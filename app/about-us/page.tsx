'use client';

import { HoverCard } from '@/components/AboutUs-HoverCard/HoverCard';
import { Team } from '@/components/AboutUs-HoverCard/OurTeam';
import { TimeLine } from '@/components/AboutUs-HoverCard/TimeLine';


export default function AboutUs() {
  return (
    <div>
      {/* 背景容器 */}
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          color: 'white',
          padding: '120px 20px',
          top: '-100px',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${background.src})`, // 添加半透明叠加层
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <h1 style={{ fontSize: '70px', fontWeight: 'bold', margin: 0 }}>腮帮子</h1>
      </div>
      <h2 style={{ margin: '30px 0', textAlign: 'center', fontSize: '30px' }}>什么是CarbonElla</h2>
      <p style={{ margin: '20px 100px', textAlign: 'center', fontSize: '20px', color: '#616161' }}>CarbonElla提供碳资产交易全流程服务，建立控排企业集成化社群，
        搭建低碳绿色业务一站式服务平台。</p>
      <p style={{ margin: '20px 100px', textAlign: 'center', fontSize: '20px', color: '#616161' }}>在中国能源转型需求迫切，“双碳战略”大背景下，CarbonElla团队
        深耕绿色低碳领域，聚焦碳资产交易市场，服务全国超 2200 家中小
        工业控排企业。
      </p>
      <h2 style={{ margin: '100px 0px 50px', textAlign: 'center', fontSize: '30px' }}>团队介绍</h2>
      <Team />
      <h2 style={{ margin: '100px 0px 50px', textAlign: 'center', fontSize: '30px' }}>项目影响力</h2>
      <TimeLine />
      <h2 style={{ margin: '100px 0px 40px', textAlign: 'center', fontSize: '30px' }}>联系我们</h2>
      <p style={{ margin: '20px 100px', textAlign: 'center', fontSize: '20px' }}>
        如您在使用本平台或与本平台的合作中遇到难以解决的问题，以及任何对平台发展有益的意见及建议，欢迎您直接写信到
        CEO邮箱：<strong>linyu.zhang@ucdconnect.ie</strong>。
      </p>

      <p style={{ margin: '20px 100px', textAlign: 'center', fontSize: '20px', }}> 为了您的来信能够得到更高效的处理，请您在邮件中标注以下信息：
      </p>
      <p style={{
        margin: '20px 450px',
        textAlign: 'left',
        fontSize: '16px',
        position: 'relative',
        paddingLeft: '25px' // 给左边添加空间，以便放置圆点
      }}>
        <span style={{
          position: 'absolute',
          left: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'green'
        }}></span>
        您的个人或工作单位信息（公司/品牌/部门/岗位/姓名 等）
      </p>

      <p style={{
        margin: '20px 450px',
        textAlign: 'left',
        fontSize: '16px',
        position: 'relative',
        paddingLeft: '25px'
      }}>
        <span style={{
          position: 'absolute',
          left: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'green'
        }}></span>
        您的联系方式（邮箱地址/直线电话 等）
      </p>

      <p style={{
        margin: '20px 450px 100px',
        textAlign: 'left',
        fontSize: '16px',
        position: 'relative',
        paddingLeft: '25px'
      }}>
        <span style={{
          position: 'absolute',
          left: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'green'
        }}></span>
        相关问题、意见或建议的具体描述（背景/案例/各类支持性材料 等）
      </p>


    </div>
  );
}
