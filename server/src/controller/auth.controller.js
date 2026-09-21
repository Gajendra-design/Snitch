export const testController = (req,res)=>{
    console.log('test sucess on server side');
    return res.send('test success on client side')
}