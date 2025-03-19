const Mock = require('mockjs');

// 生成模拟 PV 数据
const List = [];
const count = 20; // 生成 20 条模拟数据

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        metadata: {
            name: '@word',
            creationTimestamp: +Mock.Random.date('T')
        },
        status: {
            'phase|1': ['Bound', 'Available', 'Released', 'Failed']
        },
        spec: {
            accessModes: ['ReadWriteOnce', 'ReadOnlyMany', 'ReadWriteMany'],
            capacity: {
                storage: '@integer(1, 100)Gi'
            },
            claimRef: {
                name: '@word'
            }
        }
    }));
}

module.exports = [
    // 模拟获取 PV 列表接口
    {
        url: '/api/k8s/pvs',
        type: 'get',
        response: config => {
            const { filter_name, page = 1, limit = 10, namespace } = config.query;

            let mockList = List.filter(item => {
                if (filter_name && item.metadata.name.indexOf(filter_name) < 0) return false;
                return true;
            });

            const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));

            return {
                code: 20000,
                data: {
                    total: mockList.length,
                    items: pageList
                }
            };
        }
    },
    // 模拟获取 PV 详情接口
    {
        url: '/api/k8s/pvs/detail',
        type: 'get',
        response: config => {
            const { pv_name, namespace } = config.query;
            const pv = List.find(item => item.metadata.name === pv_name);

            if (!pv) {
                return {
                    code: 50000,
                    msg: `获取 PV 详情失败, 未找到名为 ${pv_name} 的 PV`
                };
            }

            return {
                code: 20000,
                data: pv
            };
        }
    },
    // 模拟更新 PV 接口
    {
        url: '/api/k8s/pvs/update',
        type: 'put',
        response: () => {
            return {
                code: 20000,
                msg: '更新成功'
            };
        }
    },
    // 模拟删除 PV 接口
    {
        url: '/api/k8s/pvs/delete',
        type: 'delete',
        response: () => {
            return {
                code: 20000,
                msg: '删除成功'
            };
        }
    }
];
