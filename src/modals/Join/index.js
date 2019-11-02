// @flow
import React from 'react'
import {
  TiMail as MailIcon,
  TiKeyOutline as PasswordIcon
} from 'react-icons/ti'
import { compose, type HOC } from 'recompose'
import firebase from 'global/firebase'
import withFirebaseAuth from 'react-with-firebase-auth'
import withMutation from 'hocs/withMutation'
import type { Form as FormType } from 'data/forms/types'
import { Ul, Li } from 'componentsStyled/Shared'
import { Text } from 'componentsStyled/Typography'
import Form from '../Form'

type Props = {
  close: Function,
}

const form: FormType[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    icon: MailIcon,
    dataType: 'string',
    required: true,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    icon: PasswordIcon,
    dataType: 'string',
    required: true,
  },
]

// type Props = {
//   signInWithEmailAndPassword: (email: string, password: string) => void,
//   createUserWithEmailAndPassword: (email: string, password: string) => void,
//   signInWithGoogle: () => void,
//   signInWithFacebook: () => void,
//   signInWithGithub: () => void,
//   signInWithTwitter: () => void,
//   signInAnonymously: () => void,
//   signOut: () => void,
//   setError: (error: any) => void,
//   user?: firebase.User,
//   error?: firebase.FirebaseError,
// }

const Join = ({ close, user, createUserWithEmailAndPassword, error, submitMutation }) => {
  const submitHandler = (input) => {
    const email = input.email
    const password = input.password

    // Add user to db table
    submitMutation(
      { email },
      users => {
        // If there is a user with this email already, don't run the mutation
        if (users.find(user => user.email === email)) {
          return false
        }

        // If there is no user with this email, run the mutation
        return true
      },
    )

    return createUserWithEmailAndPassword(email, password)
  }

  return (
    <React.Fragment>
      <Ul>
        <strong>What you get by joining the krew:</strong>
        <Li>- Create, save and load projects linked to your account.</Li>
        <Li>- Upload unlimited instruments to use in your tracks.</Li>
      </Ul>
      <Form close={close} submitName='Join krew' form={form} submitHandler={submitHandler} />
      {error &&
        <React.Fragment>
          <Text error margin={`1.5rem 0 0 0`}><strong>Error:</strong></Text>
          <Text error margin={`0.5rem 0 0 0`}>{error}</Text>
        </React.Fragment>
      }
    </React.Fragment>
  )
}

const enhancer: HOC<*, Props> = compose(
  withFirebaseAuth({
    providers: {

    },
    firebaseAppAuth: firebase.auth(),
  }),
  withMutation(
    'users',
    'post'
  ),
)

export default enhancer(Join)
