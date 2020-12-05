Create clickable prototypes in [Playroom](https://github.com/seek-oss/playroom).

This package lets you create clickable prototypes in your Playroom. It's intended for prototyping purposes.

- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
  - [`Stage`](#stage)
  - [`Frame`](#frame)
  - [`Trigger`](#trigger)

## Installation

Install the package

```sh
# npm
npm install playroom-clickable-prototypes

# yarn
yarn add playroom-clickable-prototypes
```

Then open your Playroom components file and add

```js
export * from "playroom-clickable-prototypes";
```


## Usage

Use `<Stage initial="frame-id" />` to define a stage and an initial state.

A stage can have different frames. Each `<Frame id="frame-id" />` needs to have an id. Only the active frame will be shown.

To create links between states, you can wrap any element in a `<Trigger target="frame-id" />`.

```tsx
<Stage initial="step1">

  <Frame id="step1">
    <p>First step</p>
    <Trigger target="step2">
      <button type="button">Continue</button>
    </Trigger>
  </Frame>

  <Frame id="step2">
    <p>Second step</p>
    <Trigger target="step1">
      <button type="button">Back</button>
    </Trigger>
  </Frame>

</Stage>
```

You can press the escape key twice to highlight all clickable areas.

After transitioning away from the initial frame, you can press the Escape key thrice to go back to the initial frame.


## Components

### `Stage`

- `initial` (`string`, *required*): The id of the frame to be shown initially

### `Frame`

- `id` (`string`, *required*): The id of this frame


### `Trigger`

- `target` (`string`, *required*): The id of the frame this trigger links to



