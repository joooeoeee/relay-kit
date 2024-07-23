# @reservoir0x/relay-kit-ui

## 1.1.11

### Patch Changes

- 00da309: Decouple dune balance loading from token selector

## 1.1.10

### Patch Changes

- Add review quote step, refactor modal renderers
- af694ab: Fix dollar formatting sub 0 and price impact spacing
- e231382: Color coding price impact
- Updated dependencies
- Updated dependencies [2d22eec]
  - @reservoir0x/relay-kit-hooks@1.0.15
  - @reservoir0x/relay-sdk@1.0.10

## 1.1.9

### Patch Changes

- b3432f4: Fix dropdown item hover color

## 1.1.8

### Patch Changes

- 3648ec3: Better contextualize actions based on operation
- ea3e6c5: Only show fill time on success page if sub 10s
- d5b3f82: Export TokenSelector component
- Updated dependencies [3648ec3]
- Updated dependencies [be74a6a]
  - @reservoir0x/relay-sdk@1.0.9
  - @reservoir0x/relay-kit-hooks@1.0.14

## 1.1.7

### Patch Changes

- 7445bbf: Reset canonical selection on ChainWidget unless supported

## 1.1.6

### Patch Changes

- 433ca57: Add txHashes to success and error events
- 7c8fb89: Add transaction validating event

## 1.1.5

### Patch Changes

- 4cf2285: Update chain display in token select ui

## 1.1.4

### Patch Changes

- 02c5ea0: Sort token selector by total value usd and balance

## 1.1.3

### Patch Changes

- 643c6a6: Add success screen for canonical
- Updated dependencies [1e83361]
  - @reservoir0x/relay-sdk@1.0.8
  - @reservoir0x/relay-kit-hooks@1.0.13

## 1.1.2

### Patch Changes

- eae9b4d: ChainWidget Canonical functionality

## 1.1.1

### Patch Changes

- 3f2bd68: Remove log

## 1.1.0

### Minor Changes

- 0384db0: Refactor SwapWidget and add new ChainWidget for deposit/withdraw ux

### Patch Changes

- 4335c35: Add tests and fix global axios instance
- Updated dependencies [4335c35]
  - @reservoir0x/relay-kit-hooks@1.0.12
  - @reservoir0x/relay-sdk@1.0.7

## 1.0.16

### Patch Changes

- Updated dependencies [5c1a210]
  - @reservoir0x/relay-kit-hooks@1.0.11

## 1.0.15

### Patch Changes

- Updated dependencies [ec5e68e]
  - @reservoir0x/relay-kit-hooks@1.0.10

## 1.0.14

### Patch Changes

- f7f014b: Pass source in widget

## 1.0.13

### Patch Changes

- d264b99: Fix capabilities check when coinbase wallet connected
- 5184197: Improve post transaction polling to increase speed
- Updated dependencies [5184197]
  - @reservoir0x/relay-sdk@1.0.6
  - @reservoir0x/relay-kit-hooks@1.0.9

## 1.0.12

### Patch Changes

- 4758845: Update swap time icon color code
- 5a6f8ca: Hide balance column in TokenSelector when account is not connected
- d2c94a3: Disable useCapabilities except for on coinbase wallet

## 1.0.11

### Patch Changes

- ffb9ebe: Fix button color when token selector is locked
- 1945809: Move wallet chain id check to further in the flow
- Updated dependencies [1945809]
  - @reservoir0x/relay-kit-hooks@1.0.8
  - @reservoir0x/relay-sdk@1.0.5

## 1.0.10

### Patch Changes

- b093883: Add lock token params to swap widget"

## 1.0.9

### Patch Changes

- 577658a: Update powered by reservoir to use logo
- 525e523: Fix total price impact copy
- 813be48: Add onSuccess and onError callbacks for SwapWidget
- Updated dependencies [813be48]
  - @reservoir0x/relay-kit-hooks@1.0.7

## 1.0.8

### Patch Changes

- f0ecb82: Allow same currency swapping when different recipient
- 7361f60: Fix RelayKitProvider initialization
- Updated dependencies [6b5015b]
  - @reservoir0x/relay-sdk@1.0.4
  - @reservoir0x/relay-kit-hooks@1.0.6

## 1.0.7

### Patch Changes

- 5759936: Add app fee to breakdown ui
- 0c7e56c: Fix info icon alignment
- a3d4c06: Fix input icon position
- 0a8325b: Filter token search by configured tokens
- Updated dependencies [772b657]
- Updated dependencies [2922c29]
  - @reservoir0x/relay-sdk@1.0.3
  - @reservoir0x/relay-kit-hooks@1.0.5

## 1.0.6

### Patch Changes

- 7aa524c: Add app name and fees to RelayKitProvider options
- 9ad0dda: Add token change callbacks
- 7a073f8: Fix theme override selector

## 1.0.5

### Patch Changes

- ce46e72: Strip layers from generated ui kit stylesheet
- Updated dependencies [ce46e72]
  - @reservoir0x/relay-design-system@0.0.2
  - @reservoir0x/relay-kit-hooks@1.0.4
  - @reservoir0x/relay-sdk@1.0.2

## 1.0.4

### Patch Changes

- 592feb1: Make tanstack query a peer dependency
- Updated dependencies [592feb1]
  - @reservoir0x/relay-kit-hooks@1.0.3

## 1.0.3

### Patch Changes

- ac60282: Make wagmi a peer dependency

## 1.0.2

### Patch Changes

- 2c6d3da: Fix esm import errors
- Updated dependencies [2c6d3da]
  - @reservoir0x/relay-kit-hooks@1.0.2

## 1.0.1

### Patch Changes

- 4a55654: Fix deploy script
- Updated dependencies [4a55654]
  - @reservoir0x/relay-design-system@0.0.1
  - @reservoir0x/relay-kit-hooks@1.0.1
  - @reservoir0x/relay-sdk@1.0.1

## 1.0.0

### Major Changes

- ba72406: Refactor SDK to simplify, add ui packages

### Patch Changes

- Updated dependencies [ba72406]
  - @reservoir0x/relay-design-system@0.0.0
  - @reservoir0x/relay-kit-hooks@1.0.0
  - @reservoir0x/relay-sdk@1.0.0
