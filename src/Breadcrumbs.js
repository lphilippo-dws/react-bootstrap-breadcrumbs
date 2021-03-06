// Inspired by
// https://github.com/svenanders/react-breadcrumbs/blob/master/index.js

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { getRouteParams } from 'react-router/lib/RoutingUtils';

function getBreadcrumbs(router, getTitle) {
  const routes = router.state.branch;
  let path = '';

  const breadcrumbs = routes.map(route => {
    const params = getRouteParams(route, router.state.params);
    let name = route.name ||
               route.component && (
                 route.component.displayName ||
                 route.component.name
               );

    if (getTitle) {
      const title = getTitle(name, route, params);
      if (title || title === false) {
        name = title;
      }
    }
    
    if (route.path) {
      if (route.path.indexOf('/') === 0) {
        path = route.path;
      } else {
        path += '/' + route.path;
      }
    }

    return {
      to: path,
      params,
      name
    };
  })
  .filter(obj => obj && (obj.name || obj.isActive));
  
  return breadcrumbs.map((obj, idx) => ({...obj, isActive: idx === breadcrumbs.length - 1}));
}

export default class Breadcrumbs extends Component {
  static propTypes = {
    getTitle: PropTypes.func,
    className: PropTypes.string
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  render() {
    const { router } = this.context;
    const { getTitle, className } = this.props;
    const breadcrumbs = getBreadcrumbs(router, getTitle);
  
    return (
      <ol className={className ? `breadcrumb ${className}` : 'breadcrumb'}>
        {breadcrumbs.map((breadcrumb, idx) =>
          <li className={breadcrumb.isActive && 'active'}
              key={`breadcrumb-${idx}`}>
            {breadcrumb.isActive ?
              breadcrumb.name || '...' :
              <Link to={breadcrumb.to}
                    params={breadcrumb.params}>
                {breadcrumb.name}
              </Link>
            }
          </li>
        )}
      </ol>
    );
  }
}
