#include <iostream>
#include <bits/stdc++.h>
using namespace std;


void makesecret(int s,int n,int k){
    vector<pair<int,int>> a(n);
    vector<int> m(k);
    m[0]=s;
        for (int i=1;i<k;i++) {
        m[i]=ceil(rand()%100);
    }
    
    
    for(int i=1;i<n+1;i++){
        int y=0;                            
        for(int j=0;j<k;j++){
            y=y+pow(i,j)*m[j];
        }
        a[i-1].first=i;
        a[i-1].second=y;
        
    }
    cout<<"The shares are:\n";
    cout<<"x y\n";
   
    for(int i=0;i<n;i++){
        cout<<a[i].first<<" "<<a[i].second<<endl;
    }
    





   


}
void getsecret(vector<pair<int,int>> a,int k){
    double s=0;

    for (int i=0;i<k;i++) {

        double li=1;
        for(int j=0;j<k;++j){
            if(i!=j){
                li=li*(-1*a[j].first)/(a[i].first-a[j].first);
            }
        }
        s=s+a[i].second*li;
    }
    cout<<"The secret is:\n";
    cout<<s<<endl;
}
  
int main(){
   
   int choice;
   cout<<"select your choice:\n";
    cout<<"1:GET SHARES\n";
    cout<<"2:GET SECRET\n";
    cin>>choice;
    if(choice==1){
        int s;
        cout<<"Enter the secret number:\n";
        cin>>s;
             int n;
             cout<<"Enter the number of shares you want to get:\n";

    cin>>n;
    int k;
    cout<<"Enter the threshold(k):\n";
    cin>>k;
    makesecret(s,n,k);}

    if(choice==2){
        int k;
        cout<<"Enter the number of shares you have:\n";
        cin>>k;
        vector<pair<int,int>> a(k);
        cout<<"Enter the shares:\n";
        for(int i=0;i<k;i++){
            cin>>a[i].first;
            cin>>a[i].second;
        }
    getsecret(a,k);
    }

       
        


    
   
}