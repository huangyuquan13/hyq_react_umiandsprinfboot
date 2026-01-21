import {useState,useEffect} from 'react';
import { Table,Form,Input,Button,Select,Modal, Menu } from 'antd';
const Breed = ()=>{
     const [dataSource,setDataSource]= useState([
            {id:'1',animalType:'奶牛'},
            {id:'2',animalType:'绵羊'},
            {id:'3',animalType:'山羊'},
    ])
     const columns =[
        {title:'牲畜品种',dataIndex:'animalType'},
        //操作列
        {title:'操作',dataIndex:'action',
            render:(text,record)=>{
                //text表示当前字段展示值 record表示当前的一行数据  
    return (<>
                    <Button color="primary" >启动</Button>
                    <Button color="pink" variant="text">停用</Button>
            </>)
            }
        }
    ]

      //一.获取连接中的值并展示到表格中
    const getDate =()=>{
        // const result = await getlist({});
        // console.log(result);
        // setDataSource(result.data.data);
    }
    //页面加载的时候请求数据的hook函数
    //  useEffect(()=>{
    //     getDate();
    // },[])
    //二.查询表达实例
     const [form] = Form.useForm();//绑定指定的表格
     //表单执行的回调函数
        //执行默认的submit事件 校验通过将所有的name存储为对象
     const search = (values)=>{
        console.log(values);

     }
     //按钮的重置函数
     const reset = ()=>{
        form.resetFields();// 清空表单输入框 + 重置校验状态
     }

    //三.新增表单实例
    const [addForm] = Form.useForm();

     //四弹窗管理变量与函数
    //定义弹窗控制变量open
    const [open,setOpen] = useState(false);
    //新增弹窗的显示函数
    const showModal = ()=>{
        setOpen(true);
        //默认新增人员状态为启用
        addForm.setFieldsValue({ status: 1 });
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
    }

    return(<>
         <Form layout="inline" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}
         form={form}
         onFinish={search}
         >
        <Form.Item label="名称"    name="id"
        >
            <Input placeholder="请输入"/>
        </Form.Item>
         <Form.Item label="状态"   name="status">
            <Select placeholder="请选择" defaultValue="全部">
                 <Select.Option value="全部">全部</Select.Option>
                <Select.Option value="正常">正常</Select.Option>
                <Select.Option value="停用">停用</Select.Option>
            </Select>
        </Form.Item>
        <Form.Item >
                <Button type="primary" style={{marginRight:'10px'}} htmlType="submit">查询</Button>
                <Button>重置</Button>
        </Form.Item>
    </Form>
    <Button type="primary" style={{width:'100px',margin:"20px"}} onClick={showModal}>新增</Button>
    <Table columns={columns} dataSource={dataSource}  />
     {/* 新增页面 */}
    <Modal  title={<div style={{ textAlign: 'center', width: '100%' }}>新增人员</div>} 
    open={open} 
    onOk={ok} 
    onCancel={cancel}
    >
        <Form layout="horizontal" form={addForm}>
            <Form.Item label="牲畜品种"    name="animalType">
                <Input placeholder="请输入" style={{width:'300px'}}/>
            </Form.Item>
        </Form>              
    </Modal>
    </>)
}
export default Breed;
