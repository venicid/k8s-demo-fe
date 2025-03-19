const Mock = require('mockjs');

const configMapList = Mock.mock({
    'items|10-20': [
        {
            'metadata': {
                'name': '@word',
                'creationTimestamp': '@datetime',
                'labels': {
                    '@cword(2, 4)': '@cword(2, 4)'
                }
            },
            'data': {
                '@cword(2, 4)': '@cword(2, 4)'
            }
        }
    ]
}).items;

module.exports = [
    {
        url: '/api/k8s/configmaps',
        type: 'get',
        response: (config) => {
            const { filter_name, namespace, page = 1, limit = 10 } = config.query;
            let filteredList = configMapList;
            if (filter_name) {
                filteredList = filteredList.filter(item => item.metadata.name.includes(filter_name));
            }
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedList = filteredList.slice(start, end);
            return {
                code: 200,
                data: {
                    items: paginatedList,
                    total: filteredList.length
                }
            };
        }
    },
    {
        url: '/api/k8s/configmap/detail',
        type: 'get',
        response: (config) => {
            const { configmap_name, namespace } = config.query;
            const configMap = configMapList.find(item => item.metadata.name === configmap_name);
            if (configMap) {
                return {
                    code: 200,
                    data: configMap
                };
            } else {
                return {
                    code: 404,
                    msg: 'ConfigMap not found'
                };
            }
        }
    },
    {
        url: '/api/k8s/configmap/update',
        type: 'put',
        response: () => {
            return {
                code: 200,
                msg: 'ConfigMap updated successfully'
            };
        }
    },
    {
        url: '/api/k8s/configmap/del',
        type: 'delete',
        response: () => {
            return {
                code: 200,
                msg: 'ConfigMap deleted successfully'
            };
        }
    }
];