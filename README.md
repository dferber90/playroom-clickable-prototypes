## playroom-clickable-prototypes

Create clickable prototypes in [Playroom](https://github.com/seek-oss/playroom).

### Installation

```sh
npm install playroom-clickable-prototypes
```

Then open your Playroom components definitions file and add

```js
export * from "playroom-clickable-prototypes";
```

### Usage

```tsx
  <Prototype active="start">
    <Frame id="start">
      <Trigger target="start" action="click, hovering, pressing, mouseEnter, mouseLeave">

      </Trigger>
    </Frame>
  </Prototype>
```

