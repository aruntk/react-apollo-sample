import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

const client = new ApolloClient({ uri: 'http://localhost:4000' })

const ApolloApp = (AppComponent: React.FunctionComponent<{}>) => (
  <ApolloProvider client={client}>
    <AppComponent />
  </ApolloProvider>
)

ReactDOM.render(ApolloApp(App), document.getElementById('root'))

serviceWorker.unregister()
