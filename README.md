# 부동산 실거래 정보 제공 사이트
<strong>
URL: http://ec2-3-36-175-42.ap-northeast-2.compute.amazonaws.com/
<br/>
서울시에서 거래되는 부동산(아파트,오피스텔,연립다세대)에 대한 실제로 거래된 정보를 지도상에 시각화 하여 제공하는 서비스 입니다.
</strong>
<br/>
<br/>
가장 최근에 거래된 정보와 직전 거래정보를 기준으로 등폭락을 시각화하여 이용자가 관심을 가지고 있는 지역의 매물들의 추이를 한눈에 파악할 수 있도록 하는 것을 목표로 합니다.<br/>
추가적으로 사용자가 보고있는 지역의 거래량과 평당 평균거래가의 변동률에 대한 그래프를 제공합니다.<br/>


## Refactoring backend and Feature development
- backend의 리팩토링과 기능 개발을 중점으로 진행합니다.<br/>
- 클린 아키텍처를 적용하고 각 레이어의 역할을 명확히 하여 확장성을 높이는 것을 목표로 합니다.<br/>
- DB에 대한 부하를 줄이고 클라이언트의 요청을 빠르게 처리할 수 있도록 지속 개선하고 있습니다.<br/>
- OOP를 모방하여 프로젝트를 진행합니다.<br/>
- SRP를 준수한 모듈 개발을 목표로 합니다.<br/>


## 프로젝트 아키텍처 상세
<p>
<img src="https://img.shields.io/badge/Express-%23404d59?style=flat-square&logo=Express&logoColor=white"/>&nbsp
<img src="https://img.shields.io/badge/Vue-%2335495e.svg?style=flat-square&logo=vuedotjs&logoColor=%234FC08D"/>&nbsp
</p>

```
Real_Estate_Transaction_Information-Site
 └ back                                →→→ server 폴더
     └ src                               → 클린 아키텍처를 기준으로 생성되어 있는 소스코드
        └ application                   →→ Application Business Rules (Use Cases layer)
           └ interface                   → DB와의 의존성 역전을 위한 DAO 명세
           └ service                     → 비지니스 로직
        └ config                         → 서비스 제공 및 유지관리를 위한 요소
        └ controllers                   →→ Interface Adapters : Frameworks 와 service의 연결을 담당
        └ domain                        →→ Enterprise business layer : 변하지 않는 데이터의 형태를 정의
        └ infrastructure                →→ Framworks & Drivers
           └ api                         → 외부통신 모듈(AJAX 등)
           └ database                    → DB와 관련된 요소
             └ orm                       → DB와의 연결을 위한 orm 모델 및 table 정의
             └ repositories              → DAO 객체과 data 요청을 위한 로직
           └ express                     → api 제공을 위한 웹 프레임워크
             └ routes                    → server 분기 요청 처리부
             └ index.js                  → server 정의
     └ tests                            →→ test code 폴더
        └ fake                           → 테스트 코드 수행을 위한 공통 모듈 
        └ integration                    → 통합 테스트
        └ unit                           → 유닛,모듈 테스트
     └ index.js                          → server 구동 및 공통 인스턴스 선언
 └ front                               →→→ client 폴더 : vuejs(nuxt)

```


## 제어 흐름
![image](https://user-images.githubusercontent.com/87050915/181430219-c1cd6c87-cadd-406b-a48a-6c265df82b36.png)


## 주요 기능
- 하루에 한번씩 도로교통부에서 제공하는 실거래 API로 데이터를 요청하여 데이터베이스의 정보를 자동으로 업데이트 합니다.
![image](https://user-images.githubusercontent.com/87050915/181425944-b1d79194-f544-46e3-a9c4-e39b990808ed.png)

<br/>

- 거래정보를 시각화하는데 있어서 마커의 수가 몇천개까지도 부드럽게 표시되어 지역 전체의 상세 정보를 확인 할 수 있습니다.
![image](https://user-images.githubusercontent.com/87050915/181424567-0261a3b6-478a-47a7-bbf7-f50c0ee9c089.png)

<br/>

- 원하는 지역의 변동율만을 시각화 할 수 있으며 화면에 표시된 지역내에서의 거래량 및 평당 평균매매가 흐름을 확인 할 수 있습니다.
![image](https://user-images.githubusercontent.com/87050915/181424971-100322b3-0646-4c80-b77e-f0b723c56369.png)

<br/>

- 사용자가 원하는 특정 구 혹은 동을 지정하여 해당 지역의 전체 정보를 조회 가능합니다.
![image](https://user-images.githubusercontent.com/87050915/181425376-5e7b2369-4112-409b-96dd-02b6b6722e4b.png)

<br/>


## 중요 이슈

### 데이터 제공 방식에 대한 최적화
- 데이터 베이스의 실거래 정보를 업데이트 하는 경우 기존 거래정보가 최대 3개월까지 지연 등록될 수 있는 상황을 인지하고 업데이트시 가장 최근 거래 정보를 기준으로 3개월이전 기간부터 데이터의 갱신을 시작합니다.

### 쿼리문 개선
- 거래 정보를 시각화시 직전 거래가와의 변동율을 시각화 하기 위해 기존의 테이블에서 해당 정보를 재조회 하는경우 쿼리소요시간이 1초이상이 소요되는것을 방지하기 위해 직전 거래 정보의 ID를 가지는 속성을 추가하여 업데이트시에 미리 연산이 되도록 개선했습니다.

### 에러처리 통일 및 에러 집중화
- 자동으로 업데이트를 진행하는 로직과 클라이언트로부터의 요청시 발생하는 에러의 처리 방식에 차이가 존재하고 throw와 ststus변수의 체크로의 에러핸들링에 혼용에 경우 코드의 길이와 작성에 복잡함이 증가하는 것을 확인하고 에러 랩핑 함수와 에러를 집중시킬 에러 핸들링함수로 통합하였습니다.

### 마커 랜더링 부하 최소화 
- 지도상의 마커의 생성시 네이버와 카카오 모두 약 300개 이상의 마커 생성시 상당한 처리 부하가 발생하여 사용자 이용품질 저하로 이어지는 문제가 발생했습니다. 이를 해결하기 위해 300건 이상의 마커 처리시 map API의 마커 처리 로직의 일부를 인터셉트하여 html의 시각화 로직을 직접 구현하는 것으로 불필요한 처리로 인한 부하를 최소화 할 수 있었습니다.

<br/>

## 회고 / 느낀점
### 데이터 타입 선언의 부재
- 함수를 생성하고 데이터의 흐름이 발생했을 때 해당 데이터들의 데이터가 명시적으로 정의되어 있지 않기 때문에 다른 타입의 데이터가 입력되어도 이를 코드상에서 쉽게 파악하고 해결하기 어려웠다. 또한 어떠한 타입을 담고있는 객체에 전혀 다른 타입의 데이터를 넣는 것에 제한이 없기때문에 이후 많은 보안 이슈와 버그가 생길 위험이 존재 한다고 느꼈다.

### DTO 생성의 한계
- 데이터를 담고 있는 객체의 유효성을 체크하고 형태를 강제할 수 있는 수단이 부족하여 이를 위한 코드를 작성에 따른 복잡성이 증가하는 문제가 있는 것을 확인했다. 

### express의 자유도
- espress는 많은 자유도를 가진 만큼 보안과 아키텍처에서의 많은 다양성을 가질 수 있다는 것을 알았다. 이는 소규모,개인 프로젝트에서는 빠른 개발과 결과 도출에 이점을 가질 수 있지만 협업과 인수인계에 많은 정보전달이 필요해진다는 점과 프로젝트가 커짐에 따라 발생할 요소들의 트레이드 오프에 대해 많은 고민을 하게 만들었다. 또한 이런 고민에 대한 생각이 개발자들고의 의견차이로 이어질 수 있다는 생각을 하게 되었다.

### 회고
- 많은 회사에서 typescript를 요구하고 nestJS로 넘어가는 이유를 알 수 있었다. 통일된 아키텍처와 typescript를 이용한 명확한 제한요소들이 프로젝트의 안정성과 확장성을 상당 부분 담보할 수 있다는 생각이 들었다. 이후 nestJS를 익히고 팀프로젝트를 통해 이를 확인해보고 싶다.
