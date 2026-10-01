# Mac과 독립적으로 실행하는 온라인 터미널

2026-10-01 사용자 요구: Mac이 꺼져 있어도 iPhone/iPad에서 C, C++, C# 코드를 실행하고 실행 중에 값을 입력한다.

현재 **구현과 실제 Linux 실행 검사는 완료했으며, 상시 운영 서버 계정·주소와 외부 HTTPS 연결은 아직 없다.** 기존 GitHub Pages와 Supabase는 계속 사용한다. 새 서버가 연결되기 전에는 공개 앱의 미리 입력하는 실행이 유지된다. 서버 계정 연결을 운영 완료로 표시하지 않는다.

## 실행 경로와 채택한 도구

브라우저의 기존 xterm 터미널과 모바일 입력란 → 로그인 토큰을 첫 WebSocket 프레임에 전달 → Linux gateway → 기존 Supabase의 `study-code-terminal` 인증·승인·quota → isolate 안에서 GCC(C17), G++(C++20), .NET 10/Roslyn(C#14) 컴파일·PTY 실행 → 기존 예제의 원문·입력·출력·설명 저장.

UI는 `StudyRepository.getCodeTerminal` 포트를 사용한다. Supabase SDK와 토큰 갱신은 데이터 어댑터에 둔다. 실행 gateway에는 공개 Supabase 연결 값만 둔다. service-role 키는 Supabase 함수 안에만 있으며, 사용자 프로그램의 파일·환경·인자로 전달하지 않는다. 토큰은 URL·실행 결과·예제 저장·로그에 넣지 않는다.

[IOI isolate 공식 문서](https://github.com/ioi/isolate)는 Linux namespace/cgroup을 이용하는 기존 실행 격리 도구이다. `8f185bb37f3f23e29b33b0c7727c91c13429abe3`에 고정한다. Piston의 공개 API는 대화형 입력을 제공하지 않으며 기존 컨테이너 이미지의 오래된 Node 기반과 입력/종료 보완이 필요해, 이번에는 isolate와 기존 PTY를 직접 연결했다. 격리 자체를 새로 설계하지 않았다. [isolate 매뉴얼](https://github.com/ioi/isolate/blob/master/isolate.1.txt)의 cgroup v2·systemd 설치 방법을 따른다. 컨테이너보다 전용 Linux VM을 사용한다.

장기 운영의 기본 런타임은 2028-11-14까지 지원되는 .NET10 LTS로 정했다. [Microsoft 지원 정책](https://dotnet.microsoft.com/en-us/platform/support/policy)과 [Ubuntu24.04 공식 설치 안내](https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu-install?pivots=os-linux-ubuntu-2404&tabs=dotnet10)를 적용한다.

C#은 SDK의 공식 Roslyn 컴파일러와 .NET 10 reference pack을 직접 호출한다. NuGet 다운로드와 SDK 최초 설정을 거치지 않는다. JIT의 큰 memfd가 파일 한도에 걸리므로 공식 런타임 설정 `DOTNET_EnableWriteXorExecute=0`을 지정한다. 메모리·파일·프로세스·namespace 제한은 유지한다. 별도 패키지 추가와 외부 네트워크, host 파일 접근은 지원하지 않는다.

## 반복 사용과 보존

- 실행 중 여러 번 입력, 기본 터미널 키 입력, 모바일 입력 보내기, Ctrl+C/중지, EOF, 크기 조정이 같은 프로토콜을 사용한다.
- 소스·제목·설명·미리 적은 입력값·예제 ID·수정 이력·기존 저장 키를 바꾸지 않는다. 언어 설정을 이유로 사용자 코드를 자동 수정하지 않는다.
- 실행 기록은 그 실행의 소스·실제 전달한 입력·터미널 출력이다. 연결 유실은 오류 또는 중단으로 남긴다. 기존 초안·수동 저장·서버 재시도 경로를 사용한다.
- 한 사용자의 batch와 terminal은 같은 실행 제한을 공유한다. terminal lease는 180초이며, 오래된 작업의 완료 요청이 다른 작업 또는 다른 사용자의 lease를 해제하지 못한다.
- 실행 승인과 인증을 시작 전과 실행 중 5초 간격으로 확인한다. 인증/승인 확인 실패, 중지, 연결 종료, 출력 초과 시 isolate 프로세스를 종료하고 cleanup 뒤에만 슬롯을 재사용한다.
- 컴파일 35초, 실행 120초, 총 CPU 10초/단계, 메모리 1GiB, 파일당 약20MB, 프로세스/스레드128, 입력200,000자, 출력100,000자, sandbox 임시 저장 전체512MiB로 제한한다. gateway의 기본 동시 실행은1개이며, 서비스 재시작과 tmpfs 제한으로 누적 임시 파일을 남기지 않는다.

## 준비된 설치와 연결

`server/code-terminal/install-server.sh`는 전용 Ubuntu24.04 VM에서 isolate, 공식 Node24(체크섬 확인), GCC/G++, .NET10, Caddy, systemd 서비스와 bounded tmpfs를 설치한다. 기존 Caddy 사이트가 있으면 덮어쓰지 않고 중단한다. 서비스 환경 설정도 기존 파일을 보존한다. 신규 서버를 생성하거나 결제하는 스크립트가 아니다.

1. 사용자 계정이 있는 전용 Ubuntu24.04 서버와 그 서버로 연결되는 호스트 이름을 정한다. 현재 연결된 계정은 없다.
2. 이번 배포 묶음의 `server/code-terminal`을 서버로 전달하고 root로 `bash install-server.sh <서버 호스트 이름>`을 실행한다. SSH·80/443만 외부에 열고 gateway8090은 loopback에 유지한다.
3. HTTPS `/health`와 승인된 격리 시험 계정으로 실제 입력·중지·재실행을 확인한다. 실제 공부 자료를 시험으로 실행하지 않는다.
4. GitHub repository variable `CODE_TERMINAL_URL=wss://<서버 호스트 이름>/terminal`을 설정한 뒤 승인된 Pages를 다시 빌드한다. 값은 공개 주소이며 비밀키를 넣지 않는다. 주소가 없으면 기존 온라인 batch 실행을 제공한다.
5. 공개 앱에서 iPhone/iPad 다섯 환경의 입력·저장·재열기를 확인한다. Mac 개발 서버에 연결하지 않는 WSS 주소를 사용했는지 확인한다. 물리 기기와 Mac 전원을 실제로 끈 확인은 따로 기록한다.

## 확인 근거와 남은 범위

실제 Ubuntu24.04의 [Linux 검사 Actions36838125503](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/36838125503): gateway6개와 실제 isolate8개 통과. C의 프롬프트 뒤 두 번 scanf, C++20/Korean, C# ReadLine 두 번/Korean, 컴파일 오류 후 재실행, EOF, SIGTERM 무시 프로그램 강제 중단 후 재실행, host 파일·외부 네트워크 차단/프로세스 상한, 메모리 초과 후 복귀, 실제 WebSocket부터 PTY까지 확인했다. 합성 인증을 쓰는 CI이며, 상시 운영 서버의 로그인·HTTPS 완료 증거가 아니다.

기존 Supabase 프로젝트에 `study-code-terminal`v1과 service-role 전용 `study_reserve_code_terminal`을 적용했다. 실제 endpoint의 익명/잘못된 토큰401과 CORS204, 실제 DB의 anon/authenticated 실행 불가·service-role 가능을 확인했다. 새로운 실제 사용자의 자료를 생성하지 않았다.

모바일 화면 검사는 별도 시험 페이지의 실제 컴포넌트와 모의 WebSocket 응답을 사용한다. 물리 iPhone/iPad, 실제 한글 키보드, 외부 HTTPS와 Mac 전원 종료까지 확인한 것으로 확대하지 않는다. breakpoint·변수 조사·step 실행 같은 GDB 디버깅 기능은 이번 대화형 실행 범위에 포함하지 않는다.
