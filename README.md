# mvp sample bizlogic
인증서비스입니다.   

아래와 같이 cluster에 배포하십시오.   
### local에 fetch   
kubectl명령으로 배포할 수 있는 terminal에서 git clone합니다.   
$ mkdir ~/work   
$ cd ~/work   
$ git clone https://gitlab.com/jenkins28/mvp-sample-bizlogic.git    
$ cd mvp-sample-bizlogic

### namespace 생성 & 현재 namespace 변경      

$ kubectl create namespace mvp-sample   
$ kubectl config set-context $(kubectl config current-context) --namespace mvp-sample

### mysql db POD 배포   
- volume server, path 지정   
$ cd deploy/db-mysql      
$ vi values.yaml   
28라인쯤에 있는 아래 nfs volume정보를 수정   
volume:   
  server: 169.56.88.117   
  path: /data/nfs/mysql-bizlogic   

- volume directory 작성   
NFS서버로 접속하여, 위에서 지정한 path를 생성   
예)
$ mkdir -p /data/nfs/mysql-bizlogic   
$ chmod 777 /data/nfs/mysql-bizlogic  

- helm으로 mysql db 배포
$ cd ~/work/mvp-sample-bizlogic/deploy/db-mysql   
$ helm install mysql-bizlogic . -n mvp-sample   
ICP에서는 helm install --name mysql-bizlogic . --tls   
$ kubectl get pod   

* 만약 다시 설치하려면 아래와 같이 지우고 재시도   
$ helm delete mysql-bizlogic   
  ICP는 helm delete mysql-bizlogic --purge --tls   

### bizlogic microservice 배포
$ cd ~/work/mvp-sample-bizlogic/deploy   
$ vi ingress.yaml   
- host정보를 수정합니다.     
ICP에서는 kubectl get nodes -o wide로 proxy node의 ip를 확인한후, 그 ip로 지정   
- apiVersion을 수정: ICP는 extensions/v1beta1, vanilla k8s는 networking.k8s.io/v1beta1   

$ vi config.yaml
아래 ingress 주소를 변경합니다.   

  AUTH_API_URI: http://login.169.56.88.115.nip.io   
  API_PRODUCT_URI: http://biz-logic.169.56.88.115.nip.io/api/products   

$ kubectl apply -f . 







