const Mock = require('mockjs');

// 模拟命名空间列表
const namespaceList = Mock.mock({
    'items|3-5': [
        {
            'metadata': {
                'name': '@word'
            }
        }
    ]
}).items;

// 模拟 StatefulSet 列表
const statefulSetList = Mock.mock({
    'items|10-20': [
        {
            'metadata': {
                'name': '@word',
                'creationTimestamp': '@datetime',
                'labels': {
                    '@cword(2, 4)': '@cword(2, 4)'
                }
            },
            'status': {
                'currentReplicas': '@integer(0, 10)',
                'replicas': '@integer(0, 10)'
            },
            'spec': {
                'replicas': '@integer(0, 10)',
                'template': {
                    'spec': {
                        'containers': [
                            {
                                'image': '@domain'
                            }
                        ]
                    }
                }
            }
        }
    ]
}).items;

module.exports = [
    // 模拟获取命名空间列表的 API
    {
        url: '/api/k8s/namespaces',
        type: 'get',
        response: () => {
            return {
                code: 200,
                data: {
                    items: namespaceList
                }
            };
        }
    },
    // 模拟获取 StatefulSet 列表的 API
    {
        url: '/api/k8s/statefulsets',
        type: 'get',
        response: (config) => {
            const { filter_name, namespace, page = 1, limit = 10 } = config.query;

            let filteredList = statefulSetList;

            // 根据命名空间过滤
            if (namespace) {
                // 这里简单假设所有 StatefulSet 都在同一个命名空间
                filteredList = filteredList.filter(item => true); 
            }

            // 根据名称过滤
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
    // 模拟获取 StatefulSet 详情的 API
    {
        url: '/api/k8s/statefulsets/detail',
        type: 'get',
        response: (config) => {
            const { statefulset_name, namespace } = config.query;
            const statefulset = statefulSetList.find(item => item.metadata.name === statefulset_name);

            if (statefulset) {
                return {
                    code: 200,
                    data: statefulset
                };
            } else {
                return {
                    code: 404,
                    msg: 'StatefulSet not found'
                };
            }
        }
    },
    // 模拟更新 StatefulSet 的 API
    {
        url: '/api/k8s/statefulsets/update',
        type: 'put',
        response: () => {
            return {
                code: 200,
                msg: 'StatefulSet updated successfully'
            };
        }
    },
    // 模拟删除 StatefulSet 的 API
    {
        url: '/api/k8s/statefulsets/delete',
        type: 'delete',
        response: () => {
            return {
                code: 200,
                msg: 'StatefulSet deleted successfully'
            };
        }
    }
];