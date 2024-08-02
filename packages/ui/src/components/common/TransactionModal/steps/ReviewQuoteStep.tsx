import { useEffect, useState, type FC } from 'react'
import {
  Button,
  Flex,
  Text,
  ChainTokenIcon,
  Skeleton,
  Box,
  Anchor
} from '../../../primitives/index.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type Token } from '../../../../types/index.js'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight'
import type { useQuote } from '@reservoir0x/relay-kit-hooks'
import { formatDollar } from '../../../../utils/numbers.js'
import { LoadingSpinner } from '../../LoadingSpinner.js'
import { truncateAddress } from '../../../../utils/truncate.js'
import { calculatePriceTimeEstimate } from '../../../../utils/quote.js'
import {
  faClock,
  faExclamationCircle,
  faExternalLink,
  faGasPump,
  faInfoCircle,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
import type { ChildrenProps } from '../TransactionModalRenderer.js'
import { useAccount } from 'wagmi'
import { PriceImpactTooltip } from '../../../widgets/PriceImpactTooltip.js'
import React from 'react'
import { useRelayClient } from '../../../../hooks/index.js'

type ReviewQuoteProps = {
  fromToken?: Token
  toToken?: Token
  quote?: ReturnType<typeof useQuote>['data']
  isFetchingQuote: boolean
  isRefetchingQuote: boolean
  waitingForSteps?: boolean
  swap?: () => void
  quoteUpdatedAt: number
  feeBreakdown: ChildrenProps['feeBreakdown']
  fromAmountFormatted: string
  toAmountFormatted: string
}

const SECONDS_TO_UPDATE = 30

export const ReviewQuoteStep: FC<ReviewQuoteProps> = ({
  fromToken,
  toToken,
  quote,
  isFetchingQuote,
  isRefetchingQuote,
  waitingForSteps,
  swap,
  quoteUpdatedAt,
  feeBreakdown,
  fromAmountFormatted,
  toAmountFormatted
}) => {
  const client = useRelayClient()
  const { address } = useAccount()
  const details = quote?.details
  const timeEstimate = calculatePriceTimeEstimate(quote?.details)
  const connectedWalletIsNotRecipient =
    quote && address !== quote?.details?.recipient

  const isHighPriceImpact = Number(quote?.details?.totalImpact?.percent) < -3.5
  const totalImpactUsd = quote?.details?.totalImpact?.usd
  const showHighPriceImpactError = isHighPriceImpact && totalImpactUsd

  const toChain = client?.chains?.find((chain) => chain.id === toToken?.chainId)

  const [timeLeft, setTimeLeft] = useState<number>(SECONDS_TO_UPDATE)

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now()
      const nextUpdateTime =
        (quoteUpdatedAt ? quoteUpdatedAt : now) + SECONDS_TO_UPDATE * 1000
      const timeLeft = Math.max(0, Math.floor((nextUpdateTime - now) / 1000))
      setTimeLeft(timeLeft)
    }

    // Initial update
    updateTimer()

    // Set interval for subsequent updates
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [quoteUpdatedAt])

  const breakdown = [
    {
      title: 'To address',
      value: (
        <Anchor
          target="_blank"
          href={`${toChain?.explorerUrl}/address/${quote?.details?.recipient}`}
          css={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {truncateAddress(quote?.details?.recipient)}
          <FontAwesomeIcon icon={faExternalLink} width={14} />
        </Anchor>
      )
    },
    {
      title: 'Estimated time',
      value: (
        <Flex
          align="center"
          css={{
            gap: '2',
            color:
              timeEstimate && timeEstimate.time <= 30
                ? '{colors.green.9}'
                : '{colors.amber.9}'
          }}
        >
          <FontAwesomeIcon icon={faClock} width={16} />
          <Text style="subtitle2">~ {timeEstimate?.formattedTime}</Text>
        </Flex>
      )
    },
    {
      title: 'Network cost',
      value: (
        <Flex align="center" css={{ gap: '2' }}>
          <FontAwesomeIcon
            icon={faGasPump}
            width={16}
            style={{ color: '#C1C8CD' }}
          />
          <Text style="subtitle2">
            {formatDollar(Number(quote?.fees?.gas?.amountUsd ?? 0))}
          </Text>
        </Flex>
      )
    },
    {
      title: 'Price Impact',
      value: (
        <PriceImpactTooltip
          feeBreakdown={feeBreakdown}
          tooltipProps={{ side: 'top', align: 'end' }}
        >
          {
            <div>
              <Flex align="center" css={{ gap: '1', color: 'gray8' }}>
                <Text
                  style="subtitle2"
                  color="subtle"
                  css={{
                    color: isHighPriceImpact ? 'red11' : undefined
                  }}
                >
                  {feeBreakdown?.totalFees?.priceImpactPercentage}
                </Text>
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  width={14}
                  height={14}
                  style={{
                    display: 'inline-block',
                    marginLeft: 4
                  }}
                />
              </Flex>
            </div>
          }
        </PriceImpactTooltip>
      )
    }
  ]

  return (
    <>
      <Flex align="center" css={{ gap: '1', width: '100%' }}>
        <Flex
          direction="column"
          css={{
            width: '100%',
            bg: 'gray1',
            borderRadius: 12,
            p: '3',
            gap: '1'
          }}
        >
          <ChainTokenIcon
            chainId={fromToken?.chainId}
            tokenlogoURI={fromToken?.logoURI}
            css={{ height: 30, width: 30, mb: '1' }}
          />
          {isFetchingQuote ? (
            <Skeleton css={{ height: 24, width: '100%' }} />
          ) : (
            <Text style="h6">
              {fromAmountFormatted} {fromToken?.symbol}
            </Text>
          )}
          {isFetchingQuote ? (
            <Skeleton css={{ height: 18, width: '100%' }} />
          ) : details?.currencyIn?.amountUsd &&
            Number(details?.currencyIn?.amountUsd) > 0 ? (
            <Text style="subtitle3" color="subtle">
              {formatDollar(Number(details?.currencyIn?.amountUsd))}
            </Text>
          ) : null}
        </Flex>
        <Button color="ghost" size="xs" css={{ color: 'gray9' }}>
          <FontAwesomeIcon icon={faArrowRight} width={14} height={16} />
        </Button>
        <Flex
          direction="column"
          css={{
            width: '100%',
            bg: 'gray1',
            borderRadius: 12,
            p: '3',
            gap: '1'
          }}
        >
          <ChainTokenIcon
            chainId={toToken?.chainId}
            tokenlogoURI={toToken?.logoURI}
            css={{ height: 30, width: 30, mb: '1' }}
          />

          {isFetchingQuote ? (
            <Skeleton css={{ height: 24, width: '100%' }} />
          ) : (
            <Text
              style="h6"
              css={{
                color: showHighPriceImpactError ? 'red11' : undefined
              }}
            >
              {toAmountFormatted} {toToken?.symbol}
            </Text>
          )}
          {isFetchingQuote ? (
            <Skeleton css={{ height: 18, width: '100%' }} />
          ) : details?.currencyOut?.amountUsd &&
            Number(details?.currencyOut?.amountUsd) > 0 ? (
            <Text
              style="subtitle3"
              color="subtle"
              css={{
                color: showHighPriceImpactError ? 'red11' : undefined
              }}
            >
              {formatDollar(Number(details?.currencyOut?.amountUsd))}
            </Text>
          ) : null}
        </Flex>
      </Flex>
      <Flex
        direction="column"
        align="center"
        css={{
          '--borderColor': 'colors.subtle-border-color',
          border: '1px solid var(--borderColor)',
          borderRadius: 12,
          p: '3',
          gap: '3',
          width: '100%'
        }}
      >
        {breakdown.map((item) => (
          <React.Fragment key={item.title}>
            <Flex
              justify="between"
              align="center"
              css={{ width: '100%', gap: '4' }}
            >
              <Text style="subtitle2" color="subtle">
                {item.title}
              </Text>
              {isFetchingQuote ? (
                <Skeleton css={{ width: 80, height: 21 }} />
              ) : (
                item.value
              )}
            </Flex>
            {item.title === 'To address' && connectedWalletIsNotRecipient ? (
              <Flex
                align="center"
                css={{
                  gap: '2',
                  p: '2',
                  borderRadius: 8,
                  bg: 'amber2',
                  color: 'amber10'
                }}
              >
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  width={16}
                  height={16}
                />
                <Text
                  style="subtitle3"
                  css={{ color: 'amber12', maxWidth: 300 }}
                >
                  This isn't the connected wallet address. Please verify that
                  the recipient is correct.{' '}
                </Text>
              </Flex>
            ) : null}
          </React.Fragment>
        ))}
      </Flex>
      {showHighPriceImpactError ? (
        <Flex
          align="center"
          css={{
            gap: '2',
            py: '2',
            px: '3',
            backgroundColor: 'red2',
            borderRadius: 12
          }}
        >
          <Box css={{ color: 'red9' }}>
            <FontAwesomeIcon icon={faExclamationCircle} width={16} />
          </Box>
          <Text style="subtitle3" css={{ color: 'amber12' }}>
            Due to high price impact, you will lose{' '}
            {`${formatDollar(Math.abs(Number(totalImpactUsd)))}`} on this trade.
          </Text>
        </Flex>
      ) : null}
      {isFetchingQuote || isRefetchingQuote ? (
        <Text
          style="subtitle2"
          color="subtle"
          css={{
            display: 'flex',
            gap: '3',
            alignItems: 'center',
            textAlign: 'center',
            justifyContent: 'center'
          }}
        >
          {isFetchingQuote ? 'Fetching' : 'Refreshing'} Quote <LoadingSpinner />
        </Text>
      ) : (
        <Text style="subtitle2" color="subtle" css={{ textAlign: 'center' }}>
          Quote expires in{' '}
          <Text
            style="subtitle2"
            css={{ display: 'inline-flex', color: 'primary-color' }}
          >
            {timeLeft}s
          </Text>
        </Text>
      )}

      <Button
        css={{
          justifyContent: 'center'
        }}
        color={showHighPriceImpactError ? 'error' : 'primary'}
        disabled={isFetchingQuote || isRefetchingQuote || waitingForSteps}
        onClick={() => swap?.()}
      >
        Confirm
      </Button>
    </>
  )
}
