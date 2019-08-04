import React from 'react';

const builderHOC = data => Component => {
        return <Component key = { `${data.type}${data.id}`} {...data} />
};

export default builderHOC;