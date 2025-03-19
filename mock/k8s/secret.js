const Mock = require('mockjs');

const secretList = Mock.mock({
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
            },
            'type': '@pick(["Opaque", "kubernetes.io/dockerconfigjson"])'
        }
    ]
}).items;

module.exports = [
    {
        url: '/api/k8s/secrets',
        type: 'get',
        response: (config) => {
            const { filter_name, namespace, page = 1, limit = 10 } = config.query;
            let filteredList = secretList;
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
        url: '/api/k8s/secret/detail',
        type: 'get',
        response: (config) => {
            const { secret_name, namespace } = config.query;
            const secret = secretList.find(item => item.metadata.name === secret_name);
            if (secret) {
                return {
                    code: 200,
                    data: secret
                };
            } else {
                return {
                    code: 404,
                    msg: 'Secret not found'
                };
            }
        }
    },
    {
        url: '/api/k8s/secret/update',
        type: 'put',
        response: () => {
            return {
                code: 200,
                msg: 'Secret updated successfully'
            };
        }
    },
    {
        url: '/api/k8s/secret/del',
        type: 'delete',
        response: () => {
            return {
                code: 200,
                msg: 'Secret deleted successfully'
            };
        }
    }
];