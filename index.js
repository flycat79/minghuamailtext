const cloud = require('wx-server-sdk')
cloud.init()
const nodemailer = require('nodemailer')

exports.main = async (event, context) => {
  const { companyName, Business, contactPerson, contactPhone } = event.formData
  
  // 163邮箱配置
  const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // 从环境变量读取
      pass: process.env.EMAIL_PASS  // 163邮箱授权码
    }
  })

  const mailOptions = {
    from: '"小程序通知" <your_email@163.com>',
    to: process.env.RECEIVE_EMAIL || 'your_email@163.com',
    subject: `合作申请 - ${companyName}`,
    html: `
      <h2>新的合作申请</h2>
      <p><b>公司名称：</b>${companyName}</p>
      <p><b>主营业务：</b>${Business}</p>
      <p><b>联系人：</b>${contactPerson}</p>
      <p><b>联系电话：</b>${contactPhone}</p>
      <p><b>提交时间：</b>${new Date().toLocaleString('zh-CN')}</p>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
