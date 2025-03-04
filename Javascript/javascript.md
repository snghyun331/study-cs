## 자바스크립트 실행 원리 요약
<br>

<div align=left>
	<p align="left">
		<img align="left" height=180 src="https://github.com/user-attachments/assets/95a1b962-e690-4900-9263-d9eda697b52b" />
	</p>
</div>

```tsx
function first() {
  second()
}
function second() {
  third()
}
function third() { }

first()
```


- anonymous는 처음 실행 시의 <strong>전역 콘텍스트(global context)</strong>를 의미한다.
- 자바스크립트 코드는 실행 시 기본적으로 전역 콘텍스트 안에서 돌아가고, 함수가 실행되는 동안 호출 스택에 머물러 있다가 실행이 완료되면 호출 스택에서 지워진다.
- <strong>“함수 실행”</strong>을 정확히 표현하면.. → first, second, third 함수의 실행 컨텍스트가 각각 생성되어 콜 스택에 순서대로 쌓이고, 가장 마지막에 추가된 함수부터 실행한다 는 뜻.

<br>

## 실행 컨텍스트(execution context)

- 코드를 실행하는 데 필요한 환경을 제공하는 객체
    - 함수A의 실행컨텍스트 → 함수 A를 실행하는 데 필요한 환경을 제공하는 객체
- scope, hoisting, this, function, closure 등의 동작원리를 담고 있는 자바스크립트의 핵심원리
- 실행 컨텍스트가 생성되면 자바스크립트 엔진은 실행에 필요한 여러 정보들을 담을 객체를 생성한다

<div align=center>
	<p align="center">
		<img align="center" height=360 src="https://github.com/user-attachments/assets/a8ad1874-0509-4f3e-93f3-57ae4291291d" />
	</p>
</div>

(실행 컨텍스트 안에 있는 Record와 Outer 두가지만 먼저 알아도 됨)

<br>

### 💜 호이스팅 & Record

- 호이스팅: 선언 전에도 에러가 나지 않고, 선언문이 마치 최상단에 끌어올려진 듯한 현상
  
    - 자바스립트 코드 엔진이 먼저 전체 코드를 스캔하면서 변수/함수 같은 정보를 실행 컨텍스트 어딘가에 미리 기록해놓음
      
    - 이때, 기록해놓는 곳이 <strong>Record</strong>(환경 레코드)

```tsx
/* TVChannel이 첫번째 console.log 전에 이미 만들어진 것 같음 (var 한정) */

console.log(TVChannel) // undefined 

var TVChannel = "Netflix"

console.log(TVChannel) // Netflix
```
<br>

- <strong>변수 호이스팅</strong>
    - 생성단계: 실행컨텍스트를 생성하고, 선언문만 먼저 실행해서 환경 레코드(Record)에 기록해두는 과정
        
        → 본격적인 실행에 앞서 스캔하고 준비하는 단계
        
        ```tsx
        { TVChannel : undefined   }
        ```
        
    - 실행단계: 선언문 외에 나머지 코드를 순차적으로 실행하는 단계
        
        → 필요한 경우, 생성 단계에서 환경 레코드에 기록해둔 정보를 참고하거나 업데이트 한다.
        
        ```tsx
        { TVChannel : "Netflix"   }
        ```
        
    - `var`로 선언하면, 선언과 초기화(undefined)가 동시에 이루어짐
    - let, `const`가 선언되면, 초기화가 안 이루어짐 → undefined 대신 Reference Error 발생

<br>

- <strong>함수 호이스팅</strong> : 변수 호이스팅과 동일하게 동작 (함수 표현식)
  
    - 함수 선언이 되어있지 않으면, undefined 대신 TypeError가 발생

<br>

### 💜 스코프 체이닝 & Outer

- <strong>Outer</strong> : 외부 환경 참조(Outer Environment Reference)
  
- 식별자 결정(Identifier Resolution) : 코드에서 변수나 환경의 값을 결정하는 것

⇒ Call stack 안에 동일한 식별자가 여럿일 때, 자바스립트 엔진이 어떻게 Outer을 이용해서 의사결정 하는지 알아보자.

<div align=left>
	<p align="left">
		<img align="left" height=350 src="https://github.com/user-attachments/assets/fa7e7baf-1c15-48c9-852a-f1653c28977e" />
	</p>
</div>

```jsx
let lamp = false;

function goTo2F() {
  let lamp = true;

  console.log(lamp)

  function goTo3F() {
    let pet = 'puppy';
  
    console.log(pet) // puppy
    console.log(corona) // Error!
   }

   goTo3F()
}

goTo2F()
```
<br>

- 첫번째 실행컨텍스트 생성 및 환경 레코드에 `lemp = false , goTo2F`가 기록됨
    
    ```jsx
    /* global */
    let lamp = false;
    
    function goTo2F() { ... }
    
    goTo2F()
    ```
    
    - goTo2F함수를 실행하면 새로운 실행컨텍스트가 생성됨
    - 자바스크립트 엔진은 새로 실행된 컨텍스트에 바깥 렉시컬 환경으로 돌아갈 수 있는 outer를 남겨놓는다.
        
        → 이제 필요한 경우에 이전 실행 컨텍스트의 환경 레코드에 저장된 식별자도 참조할 수 있게 됨        

- 두번째 실행컨텍스트
    
    ```jsx
    /* function goTo2F */
    let lamp = true;
    
    function goTo3F() {
    	let pet = 'puppy';
    }
    
    goTo3F()
    ```

- 세번째 실행컨텍스트
    
    ```jsx
    /* fuction goTo3F */
    let pet = 'puppy
    ```
    

**🤔 세번째 실행 컨텍스트에서 만약 console.log(corona)를 출력하고자 한다면?**

```jsx
/* fuction goTo3F */
let pet = 'puppy

console.log(corona)
```

세번째에 활성화된 실행컨텍스트의 환경레코드에는 corona가 없음 → 자바스크립트 엔진은 outer이 가리키는 바캍 렉시컬 환경으로 가서 코로나를 찾기 시작한다 → 맨 처음의 실행컨텍스트까지 찾은 후, 없기 때문에 찾기를 멈추고 Reference Error을 뱉어낸다.

<br>

(참고) 렉시컬 환경 ?

<div align=center>
	<p align="center">
		<img align="center" height=240 src="https://github.com/user-attachments/assets/33cc67ce-8acb-41ba-9529-7b7ca3538935" />
	</p>
</div>

<br>
<br>

**⬇️ 더 읽어보면 좋은 글**

https://heycoding.tistory.com/86

<br>
<br>
<br>

### 참고

https://www.youtube.com/watch?v=EWfujNzSUmw&t=645s

[https://inpa.tistory.com/entry/JS-📚-실행-컨텍스트](https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-%EC%8B%A4%ED%96%89-%EC%BB%A8%ED%85%8D%EC%8A%A4%ED%8A%B8)

Node.js의 교과서
