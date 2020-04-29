import { Amplitude, AmplitudeProvider } from '@amplitude/react-amplitude';
import { ApolloProvider } from '@apollo/react-hooks';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faBook,
  faBookReader,
  faHome,
  faUserCog,
} from '@fortawesome/free-solid-svg-icons';
import * as Sentry from '@sentry/node';
import { isBrowser } from '@unly/utils';
import { createLogger } from '@unly/utils-simple-logger';
import { AmplitudeClient, Identify } from 'amplitude-js';
import 'animate.css/animate.min.css'; // Loads animate.css CSS file. See https://github.com/daneden/animate.css
import 'bootstrap/dist/css/bootstrap.min.css'; // Loads bootstrap CSS file. See https://stackoverflow.com/a/50002905/2391795
import get from 'lodash.get';
import NextApp from 'next/app';
import 'rc-tooltip/assets/bootstrap.css';
import React, { ErrorInfo } from 'react';
import Layout from '../components/Layout';
import withUniversalGraphQLDataLoader from '../hoc/withUniversalGraphQLDataLoader';

import { AppRenderProps } from '../types/AppRenderProps';
import { LayoutProps } from '../types/LayoutProps';
import { getIframeReferrer, isRunningInIframe } from '../utils/iframe';
import '../utils/ignoreNoisyWarningsHacks'; // HACK
import '../utils/sentry';

// See https://github.com/FortAwesome/react-fontawesome#integrating-with-other-tools-and-frameworks
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
library.add(faGithub, faBook, faBookReader, faHome, faUserCog);

const fileLabel = 'pages/_app';

class NRNApp extends NextApp {
  /**
   * Renders the whole application (providers, layout, etc.)
   *
   * XXX Executed both on server and client side
   *  req, res are not accessible here
   *
   * @return {JSX.Element}
   */
  render(): JSX.Element {
    const { Component, router }: AppRenderProps = this.props;

    Sentry.configureScope((scope) => {
      // See https://www.npmjs.com/package/@sentry/node
      // Only track meaningful data from router, as it contains lots of noise
      scope.setContext('router', {
        route: router.route,
        pathname: router.pathname,
        query: router.query,
        asPath: router.asPath,
      });
    });

    Sentry.addBreadcrumb({
      // See https://docs.sentry.io/enriching-error-data/breadcrumbs
      category: fileLabel,
      message: `Rendering app for Component "${get(
        Component,
        'name',
        'unknown'
      )}" (${isBrowser() ? 'browser' : 'server'})`,
      level: Sentry.Severity.Debug,
    });

    /**
     * App rendered both on client or server (universal/isomorphic)
     *
     * @return {JSX.Element}
     * @constructor
     */
    return (
      <Component
        router={router}
      // XXX This "Component" is a dynamic Next.js page which depends on the current route
      />
    );
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key]);
      });

      Sentry.captureException(error);
    });

    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }
}

export default NRNApp;
