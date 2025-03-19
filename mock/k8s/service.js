const Mock = require('mockjs');

const serviceList = Mock.mock({
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
                'type': '@pick(["ClusterIP", "NodePort"])',
                'clusterIP': '@ip',
                'ports': [
                    {
                        'port': '@integer(1000, 65535)',
                        'protocol': '@pick(["TCP", "UDP"])',
                        'nodePort': '@integer(30000, 32767)'
                    }
                ]
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
        url: '/api/k8s/services',
        type: 'get',
        response: (config) => {
            const { filter_name, namespace, page = 1, limit = 10 } = config.query;
            let filteredList = serviceList;
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
        url: '/api/k8s/service/detail',
        type: 'get',
        response: (config) => {
            const { service_name, namespace } = config.query;
            const service = serviceList.find(item => item.metadata.name === service_name);
            if (service) {
                return {
                    code: 200,
                    data: service
                };
            } else {
                return {
                    code: 404,
                    msg: 'Service not found'
                };
            }
        }
    },
    {
        url: '/api/k8s/service/update',
        type: 'put',
        response: () => {
            return {
                code: 200,
                msg: 'Service updated successfully'
            };
        }
    },
    {
        url: '/api/k8s/service/del',
        type: 'delete',
        response: () => {
            return {
                code: 200,
                msg: 'Service deleted successfully'
            };
        }
    },
    {
        url: '/api/k8s/service/create',
        type: 'post',
        response: () => {
            return {
                code: 200,
                msg: 'Service created successfully'
            };
        }
    }
];