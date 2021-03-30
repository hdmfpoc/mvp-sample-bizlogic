# mvp sample bizlogic
backend service sample입니다.   
아래와 같이 cluster에 배포하십시오.   


# 사전준비
- k8s cluster에 연결된 PC나 VM에 접근하십시오. 
- NFS Dynamic provisiong을 사용하려면, [NFS설치와 Dynamic provisiong설정](https://happycloud-lee.tistory.com/178?category=832243)을 참조하십시오. 
- namespace변수를 만듭니다. 아래 예 참조하여 적절히 변경하세요. 
```
$ export NS=mvp-sample
```
- container image가 저장될 [Docker image registry](https://hub.docker.com)의 Organization변수를 생성합니다. 아래 예 참조하여 적절히 변경하세요. 
```
$ export IMGORG=happykube
```

# git clone   
작업디렉토리를 만들고 git clone합니다.  
```
$ mkdir -p ~/work   
$ cd ~/work   
$ git clone https://github.com/happykube/mvp-sample-bizlogic.git
$ cd mvp-sample-bizlogic
```

# namespace 생성 & 현재 namespace 변경      
```
$ kubectl create ns ${NS}   
$ kubectl config set-context $(kubectl config current-context) --namespace ${NS}
```

# mysql db POD 배포   
- deploy/db-mysql/values.yaml수정 
  - storageClassName지정: kubectl get sc로 StorageClass를 찾아 적절한 SC를 지정
  - NFS dynamic provisioning사용 여부 지정: 사용 시 volume.dynamic에 true로 지정
  - dyamic provisioning 미사용시 NFS server, path 지정: volume.nfs.server, volume.nfs.path지정   
  - [예제]
  <img src="./img/2021-03-30-13-23-29.png" width=60% height=60%/>

- dyamic provisioning 미사용시 volume directory 작성   
  ```
  NFS서버로 접속하여, 아래 예제처럼 위에서 지정한 path를 생성   
  $ mkdir -p /data/nfs/mysql-bizlogic     
  $ chmod 777 /data/nfs/mysql-bizlogic   

  ```

- helm으로 mysql db 배포
```
$ cd ~/work/mvp-sample-bizlogic/deploy/db-mysql   
$ helm install mysql-bizlogic .   
$ kubectl get pod   
```

* 만약 다시 설치하려면 아래와 같이 지우고 재시도   
```
$ helm delete mysql-bizlogic   
```

# mvp-sample-bizlogic 컨테이너 이미지 만들기
- clone한 디렉토리로 이동 
```
$ cd ~/work/mvp-sample-bizlogic 
```
- Build container image 
```
$ docker build -f deploy/Dockerfile -t ${IMGORG}/mvp-sample-bizlogic:1.0.0 .
```

- Push image 
```
$ docker login 

$ docker push ${IMGORG}/mvp-sample-bizlogic:1.0.0
```

# mvp-sample-bizlogic microservice 배포
- deploy/ingress.yaml의 spec.rules.host수정
```
$ cd ~/work/mvp-sample-bizlogic/deploy   
$ vi ingress.yaml  

- deploy/config.yaml 수정
아래 예제와 같이 mvp-sample-login과 mvp-sample-bizlogic의 ingress url로 수정합니다. 
```
  AUTH_API_URI: http://hklee.login.169.56.84.35.nip.io
  API_PRODUCT_URI: http://hklee.biz-logic.169.56.84.35.nip.io/api/products
```


$ kubectl apply -f . 
```
- PVC바인딩이 되어 있는지 확인
```
$ kubectl get pvc
```

- Pod실행여부 확인
```
$ kubectl get po
```

- Ingress주소로 웹브라우저에서 swagger page 확인
```
$ kubectl get ing
```
http://{ingress url}/api-docs으로 접근합니다.   
<img src="./img/2021-03-30-13-29-01.png" width=70% height=70%/>

