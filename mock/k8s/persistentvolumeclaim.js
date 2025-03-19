const Mock = require('mockjs');

const pvcList = Mock.mock({
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
                'storageClassName': '@word',
                'accessModes': [
                    '@pick(["ReadWriteOnce", "ReadOnlyMany", "ReadWriteMany"])'
                ]
            },
            'status': {
                'phase': '@pick(["Pending", "Bound", "Lost"])',
                'capacity': {
                    'storage': '@integer(1, 100)Gi'
                }
            }
        }
    ]
}).items;

module.exports = [
    {
        url: '/api/k8s/pvcs',
        type: 'get',
        response: (config) => {
            const { filter_name, namespace, page = 1, limit = 10 } = config.query;
            let filteredList = pvcList;
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
        url: '/api/k8s/pvc/detail',
        type: 'get',
        response: (config) => {
            const { pvc_name, namespace } = config.query;
            const pvc = pvcList.find(item => item.metadata.name === pvc_name);
            if (pvc) {
                return {
                    code: 200,
                    data: pvc
                };
            } else {
                return {
                    code: 404,
                    msg: 'PersistentVolumeClaim not found'
                };
            }
        }
    },
    {
        url: '/api/k8s/pvc/update',
        type: 'put',
        response: () => {
            return {
                code: 200,
                msg: 'PersistentVolumeClaim updated successfully'
            };
        }
    },
    {
        url: '/api/k8s/pvc/del',
        type: 'delete',
        response: () => {
            return {
                code: 200,
                msg: 'PersistentVolumeClaim deleted successfully'
            };
        }
    }
];