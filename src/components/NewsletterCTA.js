import React from 'react'
import { Machine } from 'xstate'
import { useMachine } from '@xstate/react'
import shevy, { bs } from '../shevy'
import { buttonStyles } from './Button'
import { BREAKPOINTS } from '../constants'
import { createMediaQuery, isEmail, v } from '../utils'

export default function NewsletterCTA() {
  return (
    <div
      css={{
        backgroundColor: v('components-newsletterCTA-background'),
        color: v('components-newsletterCTA-text'),
        padding: bs(2),
      }}
    >
      <div>
        <h3>
          Let's talk some more about JavaScript, React, and software
          engineering.
        </h3>
        <p>
          I write a newsletter to share my thoughts and the projects I'm working
          on. I would love for you to join the conversation. You can unsubscribe
          at any time.
        </p>

        <SignupForm />
      </div>
    </div>
  )
}

const FORM_ID = process.env.GATSBY_CONVERT_KIT_FORM_ID
const API_KEY = process.env.GATSBY_CONVERT_KIT_API_KEY
const TAG_ID = process.env.GATSBY_CONVERT_KIT_FROM_KYLESHEVLIN_DOT_COM_TAG_ID

function postNewSubscriber({ email, name }) {
  return fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: API_KEY,
      first_name: name,
      email,
      tags: [TAG_ID],
    }),
  }).then(res => {
    const data = res.json()

    if (!res.ok) {
      return Promise.reject(data)
    }

    return data
  })
}

const submitEvent = {
  SUBMIT: [
    {
      target: 'submitting',
      cond: 'isValidData',
    },
    { target: 'error' },
  ],
}

const signupMachine = Machine(
  {
    id: 'signup',
    initial: 'idle',
    states: {
      idle: {
        on: {
          ...submitEvent,
        },
      },
      submitting: {
        invoke: {
          id: 'submitData',
          src: 'submitData',
          onDone: 'success',
          onError: 'failure',
        },
      },
      error: {
        on: {
          ...submitEvent,
        },
      },
      success: {},
      failure: {
        on: {
          RETRY: 'submitting',
        },
      },
    },
  },
  {
    guards: {
      isValidData: (_, event) => {
        const { email, name } = event

        if (email === '' || name === '') return false
        return isEmail(email)
      },
    },
    services: {
      submitData: (_, event) => {
        const { email, name } = event
        return postNewSubscriber({ email, name })
      },
    },
  }
)

function SignupForm() {
  const { onChange: nameChange, value: name } = useInput()
  const { onChange: emailChange, value: email } = useInput()
  const [state, send] = useMachine(signupMachine)

  const handleSubmit = e => {
    e.preventDefault()
    send({ type: 'SUBMIT', name, email })
  }

  const getSubmitButtonText = () => {
    switch (true) {
      case state.matches('submitting'):
        return (
          <>
            <Dots /> Submitting
          </>
        )

      case state.matches('failure'):
        return 'Retry'

      default:
        return 'Submit'
    }
  }

  if (state.matches('success')) {
    return (
      <div
        css={{
          backgroundColor: v('components-newsletterCTA-successBox-background'),
          borderRadius: 4,
          color: v('components-newsletterCTA-successBox-text'),
          fontFamily: v('fonts-catamaran'),
          padding: bs(),
        }}
      >
        Thank you for subscribing to the newslettter. I appreciate it. Please
        check your inbox to confirm your subscription.
      </div>
    )
  }

  return (
    <>
      {state.matches('error') && (
        <ErrorWrap>Invalid name or email. Please try again.</ErrorWrap>
      )}

      {state.matches('failure') && (
        <ErrorWrap>
          Something went wrong while submitting the form. Please try again.
        </ErrorWrap>
      )}

      <form onSubmit={handleSubmit}>
        <div
          css={{
            display: 'grid',
            gridGap: bs(0.5),
            marginBottom: bs(),

            [createMediaQuery(BREAKPOINTS.charlie)]: {
              gridTemplateColumns: '1fr 1fr',
              gridGap: bs(),
            },
          }}
        >
          <ControlledInputBox
            label="First Name"
            name="firstName"
            onChange={nameChange}
            placeholder="You"
            value={name}
          />
          <ControlledInputBox
            label="Email Address"
            name="email"
            onChange={emailChange}
            placeholder="you@example.com"
            value={email}
          />
        </div>

        <button
          css={{
            ...buttonStyles,
            backgroundColor: v(
              'components-newsletterCTA-submitButton-background'
            ),
            color: v('components-newsletterCTA-submitButton-text'),
            fontSize: '1.25rem',
            padding: `${bs(0.5)} ${bs(0.75)}`,

            '&:hover': {
              backgroundColor: v(
                'components-newsletterCTA-submitButton-hover-background'
              ),
              color: v('components-newsletterCTA-submitButton-hover-text'),
            },
          }}
          type="submit"
        >
          {getSubmitButtonText()}
        </button>
      </form>
    </>
  )
}

const NEXT_DOTS = {
  '': '.',
  '.': '. .',
  '. .': '. . .',
  '. . .': '',
}

function Dots() {
  const [dots, setDots] = React.useState('')

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setDots(d => NEXT_DOTS[d])
    }, 350)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div
      css={{
        display: 'inline-block',
        textAlign: 'center',
        width: 30,
      }}
    >
      {dots}
    </div>
  )
}

function ErrorWrap({ children }) {
  return (
    <div
      css={{
        backgroundColor: v('components-newsletterCTA-errorBox-background'),
        borderRadius: 4,
        color: v('components-newsletterCTA-errorBox-text'),
        fontFamily: v('fonts-catamaran'),
        padding: bs(0.5),
        marginBottom: bs(0.5),
      }}
    >
      {children}
    </div>
  )
}

function ControlledInputBox({
  label,
  name,
  onChange,
  placeholder,
  type = 'text',
  value,
}) {
  return (
    <div css={{ fontFamily: v('fonts-catamaran') }}>
      <label htmlFor={name}>
        <div
          css={{
            fontSize: shevy.h4.fontSize,
            marginBottom: bs(0.25),
          }}
        >
          {label}
        </div>
        <input
          css={{
            backgroundColor: v('components-newsletterCTA-inputs-background'),
            border: 'none',
            borderRadius: 4,
            color: v('components-newsletterCTA-inputs-text'),
            padding: bs(0.5),
            width: '100%',

            '&::placeholder': {
              color: v('components-newsletterCTA-inputs-placeholderText'),
            },
          }}
          id={name}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      </label>
    </div>
  )
}

function useInput() {
  const [value, setValue] = React.useState('')

  const onChange = e => {
    setValue(e.target.value)
  }

  return {
    onChange,
    value,
  }
}
