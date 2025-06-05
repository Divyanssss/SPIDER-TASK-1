#!/bin/bash

DIR="$1" # takes the first argument as the directory to scan

if [ -z "$DIR" ]; then # check if argument is provided
  echo "Please give a folder name"
  exit 1
fi

if [ ! -d "$DIR" ]; then # check if the argument is a directory
  echo "Folder does not exist"
  exit 1
fi

mkdir -p vault # create log directory if it doesn't exist
touch vault/metadata.log # create metadata log file if it doesn't exist

for file in $(find "$DIR" -type f); do # find all files in the given directory to check them

  file1=$(basename "$file") # get base name of the file for easier matching

  if [[ "$file1" == ".env" || "$file1" == .env.* || "$file1" == *.env || "$file1" == *.env.* ]]; then # check if the file is an environment file

    

    sanitizedfile="${file}.sanitized" # define sanitized file 
    touch "$sanitizedfile"

    valid=0
    invalid=0
    rejected_lines=() # array to store rejected lines

    while read line; do
  


      if echo "$line" | grep -q "="; then # check if the line contains an equal sign(key-value pair)
        key=$(echo "$line" | cut -d= -f1) # gets the key from the line
        value=$(echo "$line" | cut -d= -f2-) # gets the value from the line

        if echo "$key" | grep -q "^[A-Z0-9_]*$"; then # check if the key is valid

          if [ "$key" = "PASSWORD" ] || [ "$key" = "SECRET" ] || [ "$key" = "TOKEN" ] || [ "$key" = "PATH" ] || [ "$key" = "EXPORT" ] || [ "$key" = "USER" ]; then
            rejected_lines+=("$line") # adds the line to the rejected lines array
            invalid=$((invalid + 1)) 
            continue
          fi

          if [ -z "$value" ]; then
            rejected_lines+=("$line")
            invalid=$((invalid + 1)) 
            continue
          fi

          if echo "$value" | grep -q " "; then
            rejected_lines+=("$line")
            invalid=$((invalid + 1))
            continue
          fi

          echo "$line" >> "$sanitizedfile" # write the valid line in sanitized file
          valid=$((valid + 1))

        else
          rejected_lines+=("$line")
          invalid=$((invalid + 1))
        fi

      else
        rejected_lines+=("$line")
        invalid=$((invalid + 1))
      fi
    done < "$file"

    perms=$(ls -l "$file" | awk '{print $1}') # get file permissions
    owner=$(ls -l "$file" | awk '{print $3}') # get file owner
    acl=$(getfacl "$file" | grep -v '^#') # get file ACL
    atri=$(getfattr "$file" | grep -v '^#') # get file extended attributes

    {
      echo "Filename: $file"
      echo "Owner-name: $owner"
      echo "Permissions: $perms"
      echo "ACL:"
      echo "$acl"
      echo "Extended Attributes:"
      echo "$atri"
      echo "no of valid lines: $valid"
      echo "no of Invalid lines: $invalid"
      echo "Rejected lines:"
      for r in "${rejected_lines[@]}"; do
        echo " - $r"
      done
      echo ""
    } >> vault/metadata.log
  fi
  mv "$sanitizedfile" "vault/$(basename "$file").sanitized"
done

echo "Sanitized files saved with .sanitized file."
echo "Metadata and rejected lines saved in vault/metadata.log"
