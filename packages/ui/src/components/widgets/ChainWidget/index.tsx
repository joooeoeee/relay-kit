import { Flex, Text, ChainIcon, Box } from '../../primitives/index.js'
import { useEffect, useState, type FC } from 'react'
import { useMounted, useRelayClient } from '../../../hooks/index.js'
import type { Address } from 'viem'
import { formatUnits, zeroAddress } from 'viem'
import TokenSelector from '../../common/TokenSelector.js'
import type { Token } from '../../../types/index.js'
import { AnchorButton } from '../../primitives/Anchor.js'
import { formatFixedLength, formatDollar } from '../../../utils/numbers.js'
import AmountInput from '../../common/AmountInput.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'
import type { Execute } from '@reservoir0x/relay-sdk'
import { WidgetErrorWell } from '../WidgetErrorWell.js'
import { BalanceDisplay } from '../../common/BalanceDisplay.js'
import { EventNames } from '../../../constants/events.js'
import SwapWidgetRenderer from '../SwapWidgetRenderer.js'
import WidgetContainer from '../WidgetContainer.js'
import SwapButton from '../SwapButton.js'
import TokenSelectorContainer from '../TokenSelectorContainer.js'
import FetchingQuoteLoader from '../FetchingQuoteLoader.js'
import FeeBreakdown from '../FeeBreakdown.js'
import WidgetTabs, { type WidgetTabId } from '../../widgets/WidgetTabs.js'
import SwapRouteSelector from '../SwapRouteSelector.js'
import { PriceImpactTooltip } from '../PriceImpactTooltip.js'

type ChainWidgetProps = {
  chainId: number
  defaultToken: Token
  tokens?: Token[]
  defaultToAddress?: Address
  defaultAmount?: string
  defaultTradeType?: 'EXACT_INPUT' | 'EXACT_OUTPUT'
  onFromTokenChange?: (token?: Token) => void
  onToTokenChange?: (token?: Token) => void
  onConnectWallet?: () => void
  onAnalyticEvent?: (eventName: string, data?: any) => void
  onSwapSuccess?: (data: Execute) => void
  onSwapError?: (error: string, data?: Execute) => void
}

const ChainWidget: FC<ChainWidgetProps> = ({
  chainId,
  tokens,
  defaultToken,
  defaultToAddress,
  defaultAmount,
  defaultTradeType,
  onFromTokenChange,
  onToTokenChange,
  onConnectWallet,
  onAnalyticEvent,
  onSwapSuccess,
  onSwapError
}) => {
  const isMounted = useMounted()
  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [tabId, setTabId] = useState<WidgetTabId>('deposit')
  const lockFromToken = tabId === 'withdraw' && (!tokens || tokens.length === 0)
  const lockToToken = tabId === 'deposit' && (!tokens || tokens.length === 0)
  const client = useRelayClient()
  const chain = client?.chains.find((chain) => chain.id === chainId)
  const isTestnet = client?.baseApiUrl?.includes?.('testnets')
  const defaultChainId = isTestnet ? 11155111 : 1

  useEffect(() => {
    if (chainId !== defaultToken.chainId) {
      console.error('Default token chainId must match ChainWidget chainId')
    }
  }, [chainId, defaultToken])

  return (
    <SwapWidgetRenderer
      transactionModalOpen={transactionModalOpen}
      defaultAmount={defaultAmount}
      defaultToAddress={defaultToAddress}
      defaultTradeType={defaultTradeType}
      defaultToToken={defaultToken}
      defaultFromToken={
        chainId !== defaultChainId
          ? {
              chainId: defaultChainId,
              address: zeroAddress,
              symbol: 'ETH',
              name: 'ETH',
              decimals: 18,
              logoURI: 'https://assets.relay.link/icons/square/1/light.png'
            }
          : undefined
      }
      fetchSolverConfig={true}
      onSwapError={onSwapError}
      onAnalyticEvent={onAnalyticEvent}
      context={tabId === 'deposit' ? 'Deposit' : 'Withdraw'}
    >
      {({
        price,
        feeBreakdown,
        fromToken,
        setFromToken,
        toToken,
        setToToken,
        swapError,
        error,
        toDisplayName,
        address,
        recipient,
        customToAddress,
        setCustomToAddress,
        tradeType,
        setTradeType,
        details,
        isSameCurrencySameRecipientSwap,
        debouncedInputAmountValue,
        debouncedAmountInputControls,
        setAmountInputValue,
        amountInputValue,
        amountOutputValue,
        debouncedOutputAmountValue,
        debouncedAmountOutputControls,
        setAmountOutputValue,
        toBalance,
        isLoadingToBalance,
        isFetchingPrice,
        isLoadingFromBalance,
        fromBalance,
        highRelayerServiceFee,
        relayerFeeProportion,
        hasInsufficientBalance,
        isInsufficientLiquidityError,
        ctaCopy,
        isFromETH,
        useExternalLiquidity,
        supportsExternalLiquidity,
        timeEstimate,
        fetchingSolverConfig,
        invalidateBalanceQueries,
        setUseExternalLiquidity,
        setDetails,
        setSwapError
      }) => {
        const handleSetFromToken = (token?: Token) => {
          setFromToken(token)
          onFromTokenChange?.(token)
        }
        const handleSetToToken = (token?: Token) => {
          setToToken(token)
          onToTokenChange?.(token)
        }

        const fromChain = client?.chains?.find(
          (chain) => chain.id === fromToken?.chainId
        )

        const toChain = client?.chains?.find(
          (chain) => chain.id === toToken?.chainId
        )

        useEffect(() => {
          if (
            !supportsExternalLiquidity &&
            useExternalLiquidity &&
            !fetchingSolverConfig
          ) {
            setUseExternalLiquidity(false)
          }
        }, [
          supportsExternalLiquidity,
          useExternalLiquidity,
          fetchingSolverConfig
        ])

        return (
          <WidgetContainer
            transactionModalOpen={transactionModalOpen}
            setTransactionModalOpen={setTransactionModalOpen}
            fromToken={fromToken}
            toToken={toToken}
            swapError={swapError}
            price={price}
            address={address}
            recipient={recipient}
            amountInputValue={amountInputValue}
            amountOutputValue={amountOutputValue}
            debouncedInputAmountValue={debouncedInputAmountValue}
            debouncedOutputAmountValue={debouncedOutputAmountValue}
            tradeType={tradeType}
            onSwapModalOpenChange={(open) => {
              if (!open) {
                setSwapError(null)
              }
            }}
            useExternalLiquidity={useExternalLiquidity}
            invalidateBalanceQueries={invalidateBalanceQueries}
            onSwapSuccess={onSwapSuccess}
            onAnalyticEvent={onAnalyticEvent}
            setCustomToAddress={setCustomToAddress}
            timeEstimate={timeEstimate}
          >
            {({ setAddressModalOpen }) => {
              return (
                <>
                  <WidgetTabs
                    tabId={tabId}
                    setTabId={(newTabId) => {
                      if (newTabId !== tabId) {
                        if (tradeType === 'EXACT_INPUT') {
                          setTradeType('EXACT_OUTPUT')
                          setAmountInputValue('')
                          setAmountOutputValue(amountInputValue)
                        } else {
                          setTradeType('EXACT_INPUT')
                          setAmountOutputValue('')
                          setAmountInputValue(amountOutputValue)
                        }

                        handleSetFromToken(toToken)
                        handleSetToToken(fromToken)
                        debouncedAmountInputControls.flush()
                        debouncedAmountOutputControls.flush()
                        setTabId(newTabId)
                      }
                    }}
                  />
                  <TokenSelectorContainer css={{ mb: '3' }}>
                    <Flex align="center" css={{ gap: '2' }}>
                      <Text style="subtitle1">From</Text>
                      {fromChain ? (
                        <Flex align="center" css={{ gap: '1' }}>
                          <ChainIcon
                            chainId={fromToken?.chainId}
                            width={16}
                            height={16}
                          />
                          <Text style="subtitle2" color="subtle">
                            {fromChain?.displayName}
                          </Text>
                        </Flex>
                      ) : null}
                    </Flex>
                    <Flex align="center" justify="between" css={{ gap: '4' }}>
                      <TokenSelector
                        token={fromToken}
                        restrictedTokensList={
                          tabId === 'withdraw' ? tokens : undefined
                        }
                        locked={lockFromToken}
                        onAnalyticEvent={onAnalyticEvent}
                        chainIdsFilter={
                          tabId === 'withdraw' ? [chainId] : undefined
                        }
                        setToken={(token) => {
                          onAnalyticEvent?.(EventNames.SWAP_TOKEN_SELECT, {
                            direction: 'input',
                            token_symbol: token.symbol
                          })
                          if (
                            token.address === toToken?.address &&
                            token.chainId === toToken?.chainId &&
                            address === recipient
                          ) {
                            handleSetFromToken(toToken)
                            handleSetToToken(fromToken)
                          } else {
                            handleSetFromToken(token)
                          }
                        }}
                        context="from"
                      />
                      <AmountInput
                        value={
                          tradeType === 'EXACT_INPUT'
                            ? amountInputValue
                            : amountInputValue
                            ? formatFixedLength(amountInputValue, 8)
                            : amountInputValue
                        }
                        setValue={(e) => {
                          setAmountInputValue(e)
                          setTradeType('EXACT_INPUT')
                          if (Number(e) === 0) {
                            setAmountOutputValue('')
                            debouncedAmountInputControls.flush()
                          }
                        }}
                        onFocus={() => {
                          onAnalyticEvent?.(EventNames.SWAP_INPUT_FOCUSED)
                        }}
                        css={{
                          textAlign: 'right',
                          color:
                            isFetchingPrice && tradeType === 'EXACT_OUTPUT'
                              ? 'text-subtle'
                              : 'input-color',
                          _placeholder: {
                            color:
                              isFetchingPrice && tradeType === 'EXACT_OUTPUT'
                                ? 'text-subtle'
                                : 'input-color'
                          }
                        }}
                      />
                    </Flex>
                    <Flex
                      align="center"
                      justify="between"
                      css={{ gap: '3', width: '100%' }}
                    >
                      <Flex align="center" css={{ gap: '3' }}>
                        {fromToken ? (
                          <BalanceDisplay
                            isLoading={isLoadingFromBalance}
                            balance={fromBalance}
                            decimals={fromToken?.decimals}
                            symbol={fromToken?.symbol}
                            hasInsufficientBalance={hasInsufficientBalance}
                          />
                        ) : (
                          <Flex css={{ height: 18 }} />
                        )}
                        {fromBalance ? (
                          <AnchorButton
                            aria-label="MAX"
                            css={{ fontSize: 12 }}
                            onClick={() => {
                              if (fromToken) {
                                setAmountInputValue(
                                  formatUnits(
                                    isFromETH
                                      ? (fromBalance * 99n) / 100n
                                      : fromBalance,
                                    fromToken?.decimals
                                  )
                                )
                                setTradeType('EXACT_INPUT')
                                debouncedAmountOutputControls.cancel()
                                debouncedAmountInputControls.flush()
                              }
                            }}
                          >
                            MAX
                          </AnchorButton>
                        ) : null}
                      </Flex>
                      {price?.details?.currencyIn?.amountUsd &&
                      Number(price.details.currencyIn.amountUsd) > 0 ? (
                        <Text style="subtitle3" color="subtle">
                          {formatDollar(
                            Number(price.details.currencyIn.amountUsd)
                          )}
                        </Text>
                      ) : null}
                    </Flex>
                  </TokenSelectorContainer>
                  <TokenSelectorContainer>
                    <Flex css={{ width: '100%' }} justify="between">
                      <Flex align="center" css={{ gap: '2' }}>
                        <Text style="subtitle1">To</Text>
                        {toChain ? (
                          <Flex align="center" css={{ gap: '1' }}>
                            <ChainIcon
                              chainId={toToken?.chainId}
                              width={16}
                              height={16}
                            />
                            <Text style="subtitle2" color="subtle">
                              {toChain?.displayName}
                            </Text>
                          </Flex>
                        ) : null}
                      </Flex>
                      {isMounted && (address || customToAddress) ? (
                        <AnchorButton
                          css={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2'
                          }}
                          onClick={() => {
                            setAddressModalOpen(true)
                            onAnalyticEvent?.(
                              EventNames.SWAP_ADDRESS_MODAL_CLICKED
                            )
                          }}
                        >
                          <Text style="subtitle3" css={{ color: 'inherit' }}>
                            {toDisplayName}
                          </Text>
                          <FontAwesomeIcon icon={faChevronRight} width={8} />
                        </AnchorButton>
                      ) : null}
                    </Flex>
                    <Flex align="center" justify="between" css={{ gap: '4' }}>
                      <TokenSelector
                        token={toToken}
                        restrictedTokensList={
                          tabId === 'deposit' ? tokens : undefined
                        }
                        locked={lockToToken}
                        chainIdsFilter={
                          tabId === 'deposit' ? [chainId] : undefined
                        }
                        setToken={(token) => {
                          onAnalyticEvent?.(EventNames.SWAP_TOKEN_SELECT, {
                            direction: 'output',
                            token_symbol: token.symbol
                          })
                          if (
                            token.address === fromToken?.address &&
                            token.chainId === fromToken?.chainId &&
                            address === recipient
                          ) {
                            handleSetToToken(fromToken)
                            handleSetFromToken(toToken)
                          } else {
                            handleSetToToken(token)
                          }
                        }}
                        context="to"
                        onAnalyticEvent={onAnalyticEvent}
                      />
                      <AmountInput
                        value={
                          tradeType === 'EXACT_OUTPUT'
                            ? amountOutputValue
                            : amountOutputValue
                            ? formatFixedLength(amountOutputValue, 8)
                            : amountOutputValue
                        }
                        setValue={(e) => {
                          setAmountOutputValue(e)
                          setTradeType('EXACT_OUTPUT')
                          if (Number(e) === 0) {
                            setAmountInputValue('')
                            debouncedAmountOutputControls.flush()
                          }
                        }}
                        disabled={!toToken}
                        onFocus={() => {
                          onAnalyticEvent?.(EventNames.SWAP_OUTPUT_FOCUSED)
                        }}
                        css={{
                          color:
                            isFetchingPrice && tradeType === 'EXACT_INPUT'
                              ? 'gray11'
                              : 'gray12',
                          _placeholder: {
                            color:
                              isFetchingPrice && tradeType === 'EXACT_INPUT'
                                ? 'gray11'
                                : 'gray12'
                          },
                          textAlign: 'right',
                          _disabled: {
                            cursor: 'not-allowed',
                            _placeholder: {
                              color: 'gray10'
                            }
                          }
                        }}
                      />
                    </Flex>
                    <Flex
                      align="center"
                      justify="between"
                      css={{ gap: '3', width: '100%' }}
                    >
                      {toToken ? (
                        <BalanceDisplay
                          isLoading={isLoadingToBalance}
                          balance={toBalance}
                          decimals={toToken?.decimals}
                          symbol={toToken?.symbol}
                        />
                      ) : (
                        <Flex css={{ height: 18 }} />
                      )}
                      {price?.details?.currencyOut?.amountUsd &&
                      Number(price.details.currencyOut.amountUsd) > 0 ? (
                        <Flex align="center" css={{ gap: '1' }}>
                          <Text style="subtitle3" color="subtle">
                            {formatDollar(
                              Number(price.details.currencyOut.amountUsd)
                            )}
                          </Text>
                          <PriceImpactTooltip feeBreakdown={feeBreakdown}>
                            <div>
                              <Flex align="center" css={{ gap: '1' }}>
                                <Text
                                  style="subtitle3"
                                  color={
                                    feeBreakdown?.totalFees.priceImpactColor
                                  }
                                  css={{
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  (
                                  {
                                    feeBreakdown?.totalFees
                                      .priceImpactPercentage
                                  }
                                  )
                                </Text>
                                <Flex css={{ color: 'gray9' }}>
                                  <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    width={16}
                                    style={{
                                      display: 'inline-block'
                                    }}
                                  />
                                </Flex>
                              </Flex>
                            </div>
                          </PriceImpactTooltip>
                        </Flex>
                      ) : null}
                    </Flex>
                  </TokenSelectorContainer>
                  <FetchingQuoteLoader isLoading={isFetchingPrice} />
                  <SwapRouteSelector
                    chainId={chainId}
                    chainName={chain?.displayName ?? ''}
                    supportsExternalLiquidity={supportsExternalLiquidity}
                    externalLiquidtySelected={useExternalLiquidity}
                    onExternalLiquidityChange={(selected) => {
                      setUseExternalLiquidity(selected)
                    }}
                  />
                  <FeeBreakdown
                    feeBreakdown={feeBreakdown}
                    isFetchingPrice={isFetchingPrice}
                    toToken={toToken}
                    fromToken={fromToken}
                    price={price}
                    timeEstimate={timeEstimate}
                  />
                  <WidgetErrorWell
                    hasInsufficientBalance={hasInsufficientBalance}
                    hasInsufficientSafeBalance={false}
                    error={error}
                    quote={price}
                    currency={fromToken}
                    isHighRelayerServiceFee={highRelayerServiceFee}
                    relayerFeeProportion={relayerFeeProportion}
                    context="swap"
                  />
                  <SwapButton
                    transactionModalOpen={transactionModalOpen}
                    context={tabId === 'deposit' ? 'Deposit' : 'Withdraw'}
                    onConnectWallet={onConnectWallet}
                    onAnalyticEvent={onAnalyticEvent}
                    price={price}
                    address={address}
                    hasInsufficientBalance={hasInsufficientBalance}
                    isInsufficientLiquidityError={isInsufficientLiquidityError}
                    debouncedInputAmountValue={debouncedInputAmountValue}
                    debouncedOutputAmountValue={debouncedOutputAmountValue}
                    isSameCurrencySameRecipientSwap={
                      isSameCurrencySameRecipientSwap
                    }
                    onClick={() => setTransactionModalOpen(true)}
                    ctaCopy={ctaCopy}
                  />
                </>
              )
            }}
          </WidgetContainer>
        )
      }}
    </SwapWidgetRenderer>
  )
}

export default ChainWidget
