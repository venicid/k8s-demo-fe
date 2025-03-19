const Mock = require('mockjs');

// 生成模拟 Node 数据
const List = [];
const count = 20; // 生成 20 条模拟数据

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        metadata: {
            name: '@word',
            creationTimestamp: +Mock.Random.date('T'),
        },
        status: {
            addresses: [
                {
                    address: '@ip',
                },
            ],
            capacity: {
                cpu: '@integer(1, 8)',
                memory: '@integer(1024, 16384)Ki',
            },
            nodeInfo: {
                kubeletVersion: '@string("number", 3, 3)'.replace(/\d/g, 'v$&.$&.$&'),
            },
        },
        spec: {
            podCIDR: '@ip/@integer(16, 24)',
        },
    }));
}

module.exports = [
    // 模拟获取 Node 列表接口
    {
        url: '/api/k8s/nodes', // 假设接口地址，可根据实际情况修改
        type: 'get',
        response: config => {
            const { filter_name, page = 1, limit = 10 } = config.query;

            let mockList = List.filter(item => {
                if (filter_name && item.metadata.name.indexOf(filter_name) < 0) return false;
                return true;
            });

            const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));

            return {
                code: 20000,
                data: {
                    total: mockList.length,
                    items: pageList,
                },
            };
        },
    },
    // 模拟获取 Node 详情接口
    {
        url: '/api/k8s/nodes/detail', // 假设接口地址，可根据实际情况修改
        type: 'get',
        response: config => {
            const { node_name } = config.query;
            const node = List.find(item => item.metadata.name === node_name);
            return {
                code: 20000,
                data: node || {},
            };
        },
    },
    // 模拟更新 Node 接口
    {
        url: '/api/k8s/nodes/update', // 假设接口地址，可根据实际情况修改
        type: 'put',
        response: () => {
            return {
                code: 20000,
                msg: '更新成功',
            };
        },
    },
    // 模拟删除 Node 接口
    {
        url: '/api/k8s/nodes/delete', // 假设接口地址，可根据实际情况修改
        type: 'delete',
        response: () => {
            return {
                code: 20000,
                msg: '删除成功',
            };
        },
    },
];
