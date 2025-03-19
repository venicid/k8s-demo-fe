const Mock = require('mockjs');

const ingressList = Mock.mock({
    'items|10-20': [
        {
            'metadata': {
                'name': '@word',
                'creationTimestamp': '@datetime',
                'labels': {
                    '@cword(2, 4)': '@cword(2, 4)'
                }
            },
            'spec': {
                'rules': [
                    {
                        'host': '@domain',
                        'http': {
                            'paths': [
                                {
                                    'path': '/@word'
                                }
                            ]
                        }
                    }
                ],
                'tls': '@boolean'
            },
            'status': {
                'loadBalancer': {
                    'ingress': [
                        {
                            'ip': '@ip'
                        }
                    ]
                }
            }
        }
    ]
}).items;

module.exports = [
    {
        url: '/api/k8s/ingresses',
        type: 'get',
        response: (config) => {
            const { filter_name, namespace, page = 1, limit = 10 } = config.query;
            let filteredList = ingressList;
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
        url: '/api/k8s/ingress/detail',
        type: 'get',
        response: (config) => {
            const { ingress_name, namespace } = config.query;
            const ingress = ingressList.find(item => item.metadata.name === ingress_name);
            if (ingress) {
                return {
                    code: 200,
                    data: ingress
                };
            } else {
                return {
                    code: 404,
                    msg: 'Ingress not found'
                };
            }
        }
    },
    {
        url: '/api/k8s/ingress/update',
        type: 'put',
        response: () => {
            return {
                code: 200,
                msg: 'Ingress updated successfully'
            };
        }
    },
    {
        url: '/api/k8s/ingress/del',
        type: 'delete',
        response: () => {
            return {
                code: 200,
                msg: 'Ingress deleted successfully'
            };
        }
    },
    {
        url: '/api/k8s/ingress/create',
        type: 'post',
        response: () => {
            return {
                code: 200,
                msg: 'Ingress created successfully'
            };
        }
    }
];