// @flow
import React from 'react'
import { default as Uploader } from 'components/JSONUploader'
import { default as Menu } from 'components/Navbar/_Menu'
import InstrumentsMenu from 'components/Navbar/InstrumentsMenu'
import Login from 'modals/Login'
import Join from 'modals/Join'
import firebase from 'global/firebase'
import {
  TiUser as LoginIcon,
  TiUserAdd as JoinIcon,
  TiEject as LogoutIcon,
  TiDocumentAdd as NewProjectIcon,
  TiEdit as SaveProjectIcon,
  TiFolderOpen as LoadProjectIcon,
  TiGroup as CommunityIcon,
} from 'react-icons/ti'
import {
  saveProject, exportProject, importProject
} from 'data/projects/helpers'

const exploreLink = {
  name: 'Explore',
  icon: <CommunityIcon />,
  to: '/explore',
}

const createProjectLink = {
  name: 'New project',
  icon: <NewProjectIcon />,
  to: '/'
}

const projectLinks = {
  name: 'Project',
  component: () => <Menu options={[
      {
        name: 'Save',
        icon: SaveProjectIcon,
        onClick: () => saveProject(),
      },
      {
        name: 'Export (.json)',
        icon: SaveProjectIcon,
        onClick: () => exportProject(),
      },
      {
        name: 'Import (.json)',
        icon: LoadProjectIcon,
        component: () => <Uploader callback={content => {
          importProject(content)
        }} />,
      },
    ]} />,
}

const accountLinks = {
  name: 'Account',
  component: () => <Menu options={[
      {
        name: 'Log out',
        icon: LogoutIcon,
        onClick: () => firebase.auth().signOut(),
      },
    ]} />,
}

const memberLinks = {
  name: 'Access',
  component: () => <Menu options={[
      {
        name: 'Login',
        icon: LoginIcon,
        component: props => <Login {...props} />,
      },
      {
        name: 'Join',
        icon: JoinIcon,
        component: props => <Join {...props} />,
      },
    ]} />,
}

const instrumentsMenu = {
  name: 'Instruments',
  component: () => <InstrumentsMenu />,
}

export const loggedInLinks = (): [] => {
  const url = window.location.pathname.split('/')
  console.log('url: ', url)

  // Explore links
  if (url[1] === 'explore') {
    return [createProjectLink, accountLinks]
  }


  // Project links
  if (!url[1]) {
    return [exploreLink, projectLinks, instrumentsMenu, accountLinks]
  }

  return []
}

export const loggedOutLinks = () => [
  exploreLink,
  instrumentsMenu,
  memberLinks,
]
