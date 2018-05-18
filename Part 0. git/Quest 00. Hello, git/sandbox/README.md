# git 정리
1. git 기초
    * 버전 관리란?
        * 파일 변화를 시간에 따라 기록했다가 나중에 특정 시점의 버전을 다시 꺼내올 수 있는 시스템.
    * 버전 관리 시스템을 왜 사용할까?
        1. 현재 개발중인 버전과 릴리즈 된 버전을 분리할 수 있다. 같은 소스의 여러 revision을 관리할 수 있다. revision을 관리한다는 말은 현재 작업한 버전과 어제 완료하여 출시한 버전으로 따로 구분할 수 있다는 말이다.
        1. History 관리 기능이 강력하다. 공동 작업 시 누가 어느 부분을 수정했는지 알기 힘든데 vcs는 소스의 추가, 수정, 삭제 등을 모두 추적할 수 있고, 잘못된 부분이 있어도 그 이전으로 손쉽게 돌아갈 수 있다.
        1. 중앙 집중적 소스관리이다. 이는 다른 사람들이 개인의 컴퓨터에서 코드를 손실할 시 모든 것을 처음부터 해야할 수도 있는데 반해 하나의 중앙 시스템이 관리함으로써 소스코드를 안전하게 보관할 수 있다.(중앙 시스템이 먹통이 되는 경우라면...?)
    * 로컬 VCS
        * 간단한 데이터 베이스를 사용해서 파일의 변경 정보를 관리
        * RCS(Revision Control System)
    * CVCS
        * CVS, Subversion, Perforce 같은 시스템은 파일을 관리하는 서버가 별도로 있고 클라이언트가 중앙 서버에서 파일을 받아서 사용함.
        * 중앙 서버에서 문제가 발생한다면 해결하는 동안 아무도 다른 사람과 협업 할 수 없다. 또 중앙 데이터베이스의 하드디스크에 문제가 생기면 그 동안의 히스토리를 모두 잃을 수 있다.
![CVCS image](CVCS.png) (이미지 출처: https://git-scm.com/book/ko/v2/%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-%EB%B2%84%EC%A0%84-%EA%B4%80%EB%A6%AC%EB%9E%80%3F)
    
    * 형상관리 툴 비교
        * https://en.wikipedia.org/wiki/Comparison_of_version_control_software
        * http://imover.tistory.com/9 
    * DVCS(분산 버전 관리 시스템)
        * Git, Mercurial, Bazaar, Darcs같은 시스템. 단순히 파일의 마지막 스냅샷을 checkout하는 것이 아니라 저장소를 전부 복제한다.
        * 서버에 문제가 생기면 저장소를 복제하므로 다시 작업을 시작할 수 있다.
        * 대부분의 DVCS 환경에서는 리모트 저장소가 존재한다. 리모트 저장소가 많을 수도 있다. 이를 통해 다양한 그룹과 다양한 방법으로 협업을 진행할 수 있다.
![DVCS image](DVCS.png) (이미지 출처: https://git-scm.com/book/ko/v2/%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-%EB%B2%84%EC%A0%84-%EA%B4%80%EB%A6%AC%EB%9E%80%3F)

    * git의 목표
        * 빠른 속도
        * 단순한 구조
        * 비선형적인 개발(수천 개의 동시 다발적인 브랜치)
        * 완벽한 분산
        * Linux 커널 같은 대형 프로젝트에도 유용할 것(속도나 데이터 크기 면에서)
    * git의 기초
        * svn과 같은 형상 관리 툴과 git의 차이는 데이터를 다루는 방법에 있다.
        * svn과 같은 툴은 파일의 변화를 시간순으로 관리하며 파일들의 집합을 관리한다.
        * git은 데이터를 파일 시스템 스냅샷으로 취급하고 크기가 아주 작다. 데이터를 스냅샷의 스트림처럼 취급한다.
        * 거의 모든 명령을 로컬에서 실행한다. 이는 네트워크에 접속하는 것이 아니기에 속도가 빠르다.
        * git은 프로젝트의 히스토리를 조회할 때 서버 없이 조회. 로컬 데이터베이스의 히스토리를 읽어서 보여준다.
        * git의 무결성: git은 데이터를 저장하기 전에 항상 체크섬을 구하고 그 체크섬으로 데이터를 관리한다.
        이러한 체크섬을 이해하는 git 없이는 어떠한 파일이나 디렉토리도 변경할 수 없다.
        * **체크섬**: git에서 사용하는 가장 기본적인 데이터 단위이자 기본 철학. 깃은 sha-1해시를 사용하여 체크섬을 만든다. 40자 길이의 16진수 문자열. 파일의 내용이나 디렉토리 구조를 이용하여 체크섬을 구한다. git은 파일의 이름으로 저장하는 것이 아닌 해당 파일의 해시로 저장한다.
    * Snapshot이란?
        * 기술적인 용어로, 특정 시간에 저장 장치의 상태를 나타냄
    * 세 가지 상태
        1. Committed: 데이터가 로컬 데이터베이스에 안전하게 저장됐다는 것을 의미한다. git 디렉토리에 있는 상태.
        1. Modified: 수정한 파일을 아직 커밋하지 않은 것. Checkout 후 수정까지 했지만 staging area에 추가하지 않은 상태.
        1. Staged: 현재 수정한 파일을 곧 커밋할 것이라고 표시한 상태. Stageing area에 들어가 있는 상태
![status image](status.png) (이미지 출처: https://git-scm.com/book/ko/v2/%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-Git-%EA%B8%B0%EC%B4%88)

    * Git 디렉토리
        * git이 프로젝트의 메타데이터와 객체 데이터베이스를 저장하는 곳을 말한다.
        * git의 핵심
    * 워킹 트리
        * 프로젝트의 특정 버전을 checkout한 것이다. git 디렉토리는 지금 작업하는 디스크에 있고 그 디렉토리 안에 압축된 데이터베이스에서 파일을 가져와서 워킹 트리를 만든다.
    * Staging area
        * git 디렉토리에 있다. 단순한 파일이고 곧 커밋할 파일에 대한 정보를 저장한다. 종종 index라고 불리기도 한다.
    * git으로 하는 일
        1. 워킹트리에서 파일을 수정한다.
        1. Staging area에 파일을 stage해서 커밋할 스냅샷을 만든다.
        1. Staging area에 있는 파일들을 커밋해서 git 디렉토리에 영구적인 스냅샷으로 저장.


#### 참고사이트: git(https://git-scm.com/book/ko/v2/)