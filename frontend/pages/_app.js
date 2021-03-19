import React from 'react'
import NProgress from 'nprogress'
import Router from 'next/router'

import Page from '../components/Page'

import { ApolloProvider } from '@apollo/client'

import '../components/styles/nprogress.css'
import withData from '../lib/withData'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const MyApp = ({ Component, pageProps, apollo }) => {
  return (
    <ApolloProvider client={apollo}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  )
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {}

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  pageProps.query = ctx.query
  return { pageProps }
}

export default withData(MyApp)
