import {useState,useEffect} from 'react';
import { Table,Form,Input,Button,Select,Radio, Modal, message  } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';
import {getSearch,addPerson,updatePerson,toggleUserStatus,refreshLoginTime} from '@/services/Login/login'
const index = ()=>{
    const [dataSource,setDataSource]= useState([])
      //六.分页的状态 
    const [pagination, setPagination] = useState({
        current: 1, // 默认当前页为第一页
        pageSize: 10, // 每页条数
        total: 0 // 总条数（从接口返回）
    });
    //存储当前查询条件
    const [currentSearchParams, setCurrentSearchParams] = useState({}); 
    const columns =[
        {title:'登录账号',dataIndex:'id'},
        {title:'人员姓名',dataIndex:"realName"},
        {title:'手机号',dataIndex:'phone'},
         { 
         title: '用户状态', 
         dataIndex: 'status', 
        render: (status) => status === 1 ? '启用' : '停用' 
         },
        //操作列
        {title:'操作',dataIndex:'action',
            render:(text,record)=>{
                //text表示当前字段展示值 record表示当前的一行数据
         // 根据record.status（0/1）显示不同按钮
        const isEnabled = record.status === 1; //这个条件是真的
               
    return (<>
                <Button color="primary" onClick={()=>update(record)}>修改</Button>
                <Button 
            color={isEnabled ? "pink" : "green"} 
            variant="text"
            onClick={()=>startAndStop(record)}
          >
            {isEnabled ? '停用' : '启用'}
          </Button>
            </>)
            }
        }
    ]

   

    const items= [
  {
    key: '1',
    label: '高级选项1',
  },
  {
    key: '2',
    label: '高级选项2',
  },
  {
    key: '3',
    label: '高级选项3',
  },
];
    //一.获取连接中的值并展示到表格中
    // pageParams = {}是最后传递给后端的参数对象
    const getDate =async (pageParams = {})=>{
        console.log('传递的参数',pageParams);
            //合并覆盖 先创立对象 两个属性 再合并pageParams中所有的属性
          const params = {
            size: 10,            // 基础默认值
            ...pagination,       // 合并当前分页状态
            ...currentSearchParams, // 合并查询条件
            ...pageParams        // 传入参数覆盖所有（分页/重置）
             };
        const result = await getSearch(params);
        console.log('回来的数据',result);
        setDataSource(result.data.records);
        //更新分页信息 添加覆盖
         setPagination(prev => {
            const newPagination = {
            ...prev,
            current: params.current,
            size: params.size,
            total: result.data.total
            };
            console.log('分页信息',newPagination);
            return newPagination;
  });
        

    }
    //用来页面初次加载请求 依赖是一个空数组 
    //页面加载的时候请求数据的hook函数
     useEffect(()=>{
        getDate();
    },[])
    //二.查询表达实例
     const [form] = Form.useForm();//绑定指定的表格
     //表单执行的回调函数
        //执行默认的submit事件 校验通过将所有的name存储为对象
     const search = async(values)=>{
            console.log('自己查询的东西',values);
            //处理值转换
            const searchParams = {
            ...values,
            // 把字符串状态转成后端需要的数字
            real_name: values.realName?.trim() || undefined, 
            // 手机号去除首尾空格
            phone: values.phone?.trim() || undefined, 
            status: values.status === '启用' ? 1 : 
                    values.status === '停用' ? 0 : 
                    undefined, 
            };
          const params = {
                current: 1, 
                size: 10,   
                ...searchParams 
             };
        const res = await getSearch(params)
       
        console.log('查询结果',res);
        //重新给dataSource赋值
        setDataSource(res.data.records)

        //更新分页信息 添加覆盖
        setPagination({
            ...pagination,
            current: 1,
            total: res.data.total
          });
        //存储当前的查询条件
        setCurrentSearchParams(params);
     }
     //按钮的重置函数
     const reset = ()=>{
        form.resetFields();
         getDate({ 
            current: 1, 
            size: 10,
            real_name: undefined,
            phone: undefined,
            status: undefined
            });
        // 同步清空状态
        setCurrentSearchParams({});
     }

    //三.新增表单实例
    const [addForm] = Form.useForm();
     const add = async(values)=>{
        //1.拿取表达数据 values
        //2.调用接口
         //处理值转换
           const addParams = {
            realName: values.realName, 
            phone: values.phone,      
            status: values.status === '启用' ? 1 : 0,  
    };
    console.log("新增用户参数",addParams);
    
        //    debugger;
           //通过调入的接口函数来确认
        let result = null;
        if (editData){
             result = await updatePerson({...addParams,id:editData.id});
                message.success('修改用户成功');
             //解构赋值并传递id？
        }
        else{
            
        //2.调用接口传递数据
          result = await addPerson(addParams);
             message.success('新增用户成功');
        }
        

          //3.重新加载列表数据
        getDate();

        //4.将model弹窗的确认绑定自己的提交函数ok
        setOpen(false)

        //5.清空表单
        addForm.resetFields();
          //five.清空编辑数据
        setEditData(null);


     }
     //四弹窗管理变量与函数
    //定义弹窗控制变量open
    const [open,setOpen] = useState(false);
    //新增弹窗的显示函数
    const showModal = ()=>{
        setOpen(true);
        //默认新增人员状态为启用
        addForm.setFieldsValue({ status: '启用' });
    }
    //新增弹窗的确认函数
    const ok = ()=>{
        //调用新增表单实例 进行原本表单的提交事件
        addForm.submit();
        //最后就是检验通过够调用addForm中的回调函数
        
    }
     const cancel = ()=>{
         setOpen(false);
           //清空表单
        addForm.resetFields();
         setEditData(null);
    }
      //五 编辑事件 与新增的共用一个表单 数据回显
    //新增数据改成编辑数据
    //让新增改为修改 one.定义被编辑的数据 
    const [editData,setEditData] = useState(null);
    const update = (record)=>{
        //1.拿到表单 当前行 数据 record

        //2.定义编辑数据变量接收数据
        const editData = {...record};//浅拷贝
        //two.设置编辑数据
        setEditData(editData);
        //3.打开弹窗并回显数据  
        setOpen(true);
        //4.将弹窗提交过来的字段有01改为数据的启用和停用
        const statusText = editData.status === 1 ? '启用' : '停用';
        //调用新增表单实例 进行赋值
        addForm.setFieldsValue({...editData,status:statusText});
        //three.设置弹窗标题为动态的 有数据就编辑 没有数据就新增
        //four.最后弹窗关闭时候得清空数据 
    }
  
    //七 停用/启用用户
    const startAndStop = async (record) => {
        //停用是真的嘛 
         const isEnable = record.status === 0; 
        // 调用停用/启用接口
        await toggleUserStatus(record.id,isEnable);
        message.success(record.status === 1 ? '停用成功' : '启用成功');
        // 刷新当前页数据
        getDate();
    };


    return(<>
    <Form layout="inline" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}
        form={form} onFinish={search}
    >
        <Form.Item label="人员姓名"    name="realName"
        >
            <Input placeholder="请输入"/>
        </Form.Item>
         <Form.Item label="手机号"   name="phone">
            <Input placeholder="请输入"/>
        </Form.Item>
         <Form.Item label="状态"   name="status">
            <Select placeholder="请选择" defaultValue="全部">
                 <Select.Option value="全部">全部</Select.Option>
                <Select.Option value="启用">启用</Select.Option>
                <Select.Option value="停用">停用</Select.Option>
            </Select>
        </Form.Item>
        <Form.Item >
                {/* 点击查询先通过rules检验 通过后将所有name 在执行表单的回调函数search */}
                <Button type="primary" style={{marginRight:'10px'}} htmlType="submit">查询</Button>
                <Button onClick={reset}>重置</Button>
        </Form.Item>
         <Form.Item >
                <Dropdown
                        menu={{
                        items,//下拉菜单的选项列表
                        selectable: true,
                        defaultSelectedKeys: ['3'],//默认选中的项
                        }}
                    >   
                    {/* 无框文字链接 */}
                    {/* 下拉箭头图标 */}
                        <Typography.Link>
                            <Space>
                                高级选项
                                <DownOutlined />
                            </Space>
                        </Typography.Link>
                </Dropdown>
        </Form.Item>   
    </Form>
    <Button type="primary" style={{width:'100px',margin:"20px"}} onClick={showModal}>新增</Button>
    <Table columns={columns} dataSource={dataSource}  
      pagination={{
    ...pagination,
    // 分页切换回调
    onChange: (current, pageSize) => {
      setPagination({ ...pagination, current, pageSize });
      getDate({ current, size: pageSize });
    },
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条数据` 
  }}
    />
    {/* 新增页面 */}
    <Modal  title={editData ? '编辑用户' : '新增用户'} 
    open={open} 
    onOk={ok} 
    onCancel={cancel}

    >
        <Form layout="horizontal" form={addForm} onFinish={add}>
            <Form.Item label="人员姓名"    name="realName">
                <Input placeholder="请输入" style={{width:'200px'}}/>
            </Form.Item>
            <Form.Item label="手机号"    name="phone">
                <Input placeholder="请输入" style={{width:'200px'}}/>
            </Form.Item>
            <Form.Item label="人员状态"    name="status">
                <Radio.Group>
                    <Radio value="启用">启用</Radio>
                    <Radio value="停用">停用</Radio>
                </Radio.Group>
            </Form.Item>
        </Form>              
    </Modal>
   
    </>)
}
export default index;