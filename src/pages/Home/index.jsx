/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Input,
  ScrollList,
  ScrollItem,
  Collapse,
} from '@douyinfe/semi-ui';
import { API, showError, copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import {
  IconGithubLogo,
  IconPlay,
  IconFile,
  IconCopy,
  IconCreditCard,
  IconShield,
  IconBolt,
  IconCustomerSupport,
  IconTick,
} from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  Moonshot,
  OpenAI,
  XAI,
  Zhipu,
  Volcengine,
  Cohere,
  Claude,
  Gemini,
  Suno,
  Minimax,
  Wenxin,
  Spark,
  Qingyan,
  DeepSeek,
  Qwen,
  Midjourney,
  Grok,
  AzureAI,
  Hunyuan,
  Xinference,
} from '@lobehub/icons';

const { Text, Title, Paragraph } = Typography;

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };
    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  if (homePageContentLoaded && homePageContent !== '') {
    return (
      <div className='w-full overflow-x-hidden'>
        <NoticeModal
          visible={noticeVisible}
          onClose={() => setNoticeVisible(false)}
          isMobile={isMobile}
        />
        <div className='overflow-x-hidden w-full'>
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              className='w-full h-screen border-none'
            />
          ) : (
            <div
              className='mt-[60px]'
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            />
          )}
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <IconShield size={32} />,
      title: '智能中转',
      desc: '智能调度流量，不再为封号担忧',
    },
    {
      icon: <IconBolt size={32} />,
      title: '官方原版',
      desc: '高可用、低延迟、原汁原味的体验',
    },
    {
      icon: <IconCustomerSupport size={32} />,
      title: '专业服务',
      desc: '1对1 技术支持与架构建议',
    },
  ];

  const plans = [
    {
      name: '体验款',
      price: '¥199',
      period: '/月',
      credit: '$208 额度',
      ratio: '约 ¥0.96 = $1 额度',
      features: ['Claude / GPT / Gemini 全模型', '技术支持'],
      highlighted: false,
    },
    {
      name: '基础款',
      price: '¥399',
      period: '/月',
      credit: '$440 额度',
      ratio: '约 ¥0.91 = $1 额度',
      features: ['Claude / GPT / Gemini 全模型', '技术支持'],
      highlighted: true,
    },
    {
      name: '主力爆款',
      price: '¥899',
      period: '/月',
      credit: '$1,060 额度',
      ratio: '约 ¥0.85 = $1 额度',
      features: ['Claude / GPT / Gemini 全模型', '专属技术支持 + 优先响应'],
      highlighted: false,
    },
  ];

  const faqItems = [
    {
      key: 'q1',
      header: 'FluxNode 是什么？',
      content:
        'FluxNode 是面向开发者的 AI API 网关服务，统一接入多家领先模型，并提供稳定、高可用、低延迟的调用体验。',
    },
    {
      key: 'q2',
      header: '支持哪些模型？',
      content:
        '支持最新旗舰的 Claude、Gemini 和 GPT 系列模型，始终保持与官方同步更新。',
    },
    {
      key: 'q3',
      header: '服务稳定性如何保证？',
      content:
        '通过多节点部署、智能调度与自动负载均衡机制，动态规避故障节点，保证高可用与一致性。',
    },
    {
      key: 'q4',
      header: '如何开始使用？',
      content:
        '注册账号后充值余额，获取 API Key，即可按文档快速接入现有项目。',
    },
  ];

  return (
    <div className='w-full overflow-x-hidden bg-[#f8fafc]'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />

      {/* Hero Section - 深色背景 */}
      <section className='relative w-full min-h-[600px] md:min-h-[700px] flex flex-col items-center justify-center px-4 py-20 overflow-hidden bg-[#0f172a]'>
        <div className='hero-orb hero-orb-purple' />
        <div className='hero-orb hero-orb-blue' />

        <div className='relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(99,102,241,0.4)] bg-[rgba(99,102,241,0.15)] mb-8'>
            <span className='w-2 h-2 rounded-full bg-[#6366f1] animate-pulse' />
            <span className='text-sm text-[#a5b4fc] font-medium tracking-wide'>
              AI API 网关
            </span>
          </div>

          <Title
            heading={1}
            className='!text-4xl md:!text-5xl lg:!text-6xl !font-bold !text-white leading-tight mb-6'
          >
            {t('重构您的 AI 编程体验')}
          </Title>

          <Paragraph
            className='!text-base md:!text-lg text-[#94a3b8] max-w-2xl mb-10 leading-relaxed'
            style={{ color: '#94a3b8' }}
          >
            稳定、高效、官方原版体验。支持最新旗舰 Claude、Gemini、GPT
            系列 AI 模型，智能调度，无封号风险。
          </Paragraph>

          <div className='flex flex-row gap-4 justify-center items-center mb-12 flex-wrap'>
            <Link to='/console'>
              <Button
                theme='solid'
                type='primary'
                size={isMobile ? 'default' : 'large'}
                className='!rounded-full !px-8 !py-3 !bg-[#6366f1] !border-[#6366f1] hover:!bg-[#5558e3] hover:!border-[#5558e3] transition-all duration-200'
                icon={<IconPlay />}
              >
                立即体验
              </Button>
            </Link>
            {docsLink && (
              <Button
                size={isMobile ? 'default' : 'large'}
                className='!rounded-full !px-8 !py-3 !border-[rgba(255,255,255,0.2)] !text-white hover:!border-[rgba(255,255,255,0.4)] !bg-transparent transition-all duration-200'
                icon={<IconFile />}
                onClick={() => window.open(docsLink, '_blank')}
              >
                {t('文档')}
              </Button>
            )}
            {isDemoSiteMode && statusState?.status?.version && (
              <Button
                size={isMobile ? 'default' : 'large'}
                className='!rounded-full !px-6 !py-3 !border-[rgba(255,255,255,0.2)] !text-white !bg-transparent'
                icon={<IconGithubLogo />}
                onClick={() =>
                  window.open('https://github.com/QuantumNous/new-api', '_blank')
                }
              >
                {statusState.status.version}
              </Button>
            )}
          </div>

          <div className='w-full max-w-xl'>
            <div className='flex flex-col md:flex-row items-center gap-3 p-3 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] backdrop-blur-sm'>
              <Input
                readonly
                value={serverAddress}
                className='!flex-1 !bg-transparent !border-none !text-[#e2e8f0] text-sm'
                size={isMobile ? 'default' : 'large'}
                suffix={
                  <ScrollList
                    bodyHeight={32}
                    style={{ border: 'unset', boxShadow: 'unset' }}
                  >
                    <ScrollItem
                      mode='wheel'
                      cycled={true}
                      list={endpointItems}
                      selectedIndex={endpointIndex}
                      onSelect={({ index }) => setEndpointIndex(index)}
                    />
                  </ScrollList>
                }
              />
              <Button
                type='primary'
                size={isMobile ? 'default' : 'large'}
                onClick={handleCopyBaseURL}
                icon={<IconCopy />}
                className='!rounded-xl !bg-[#6366f1] !border-[#6366f1] flex-shrink-0'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='relative w-full px-4 py-20 md:py-28'>
        <div className='max-w-5xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {features.map((f, i) => (
              <div
                key={i}
                className='flex flex-col items-start p-6 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white shadow-sm hover:shadow-md hover:border-[rgba(99,102,241,0.3)] transition-all duration-300 group'
              >
                <div className='w-14 h-14 rounded-xl bg-[rgba(99,102,241,0.1)] flex items-center justify-center mb-5 text-[#6366f1] group-hover:bg-[rgba(99,102,241,0.15)] transition-colors duration-300'>
                  {f.icon}
                </div>
                <Title
                  heading={4}
                  className='!text-lg !font-semibold !text-[#1e293b] mb-2'
                >
                  {f.title}
                </Title>
                <Paragraph
                  className='!text-sm !text-[#64748b] leading-relaxed'
                  style={{ color: '#64748b' }}
                >
                  {f.desc}
                </Paragraph>
              </div>
            ))}
          </div>

          <div className='grid grid-cols-3 gap-4 mt-8'>
            {[
              { value: '99.9%', label: '服务稳定性' },
              { value: '1v1', label: '专属客服' },
              { value: '7×24', label: '持续运行' },
            ].map((stat, i) => (
              <div
                key={i}
                className='flex flex-col items-center py-5 rounded-xl border border-[rgba(0,0,0,0.06)] bg-white shadow-sm'
              >
                <span className='text-2xl md:text-3xl font-bold text-[#1e293b] mb-1'>
                  {stat.value}
                </span>
                <span className='text-xs md:text-sm text-[#64748b]'>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className='relative w-full px-4 py-20 md:py-28 bg-white'>
        <div className='max-w-5xl mx-auto'>
          <div className='text-center mb-14'>
            <Title
              heading={2}
              className='!text-3xl md:!text-4xl !font-bold !text-[#1e293b] mb-4'
            >
              简单透明的定价
            </Title>
            <Paragraph
              className='!text-sm md:!text-base text-[#64748b] max-w-lg mx-auto'
              style={{ color: '#64748b' }}
            >
              订阅套餐按月付费，额度每周自动刷新，用完即止、下周恢复。
            </Paragraph>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch'>
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${
                  plan.highlighted
                    ? 'border-[#6366f1] bg-[rgba(99,102,241,0.05)] shadow-lg'
                    : 'border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(99,102,241,0.3)] hover:shadow-md'
                }`}
              >
                {plan.highlighted && (
                  <div className='absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-medium bg-[#6366f1] text-white'>
                    推荐
                  </div>
                )}

                <div className='mb-6'>
                  <Text
                    className='!text-sm !text-[#64748b] block mb-2'
                    style={{ color: '#64748b' }}
                  >
                    {plan.name}
                  </Text>
                  <div className='flex items-baseline gap-1'>
                    <span className='text-4xl font-bold text-[#1e293b]'>
                      {plan.price}
                    </span>
                    <span
                      className='text-sm'
                      style={{ color: '#64748b' }}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <div className='mt-1'>
                    <Text
                      className='!text-sm !text-[#64748b]'
                      style={{ color: '#64748b' }}
                    >
                      每月 {plan.credit}
                    </Text>
                    <br />
                    <Text
                      className='!text-xs !text-[#94a3b8]'
                      style={{ color: '#94a3b8' }}
                    >
                      {plan.ratio}
                    </Text>
                  </div>
                </div>

                <div className='flex-1'>
                  {plan.features.map((feat, j) => (
                    <div
                      key={j}
                      className='flex items-center gap-2 mb-3'
                    >
                      <IconTick
                        size={16}
                        className='text-[#6366f1] flex-shrink-0'
                      />
                      <span
                        className='text-sm'
                        style={{ color: '#475569' }}
                      >
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                <Link to='/register' className='mt-6 block'>
                  <Button
                    theme={plan.highlighted ? 'solid' : 'borderless'}
                    type={plan.highlighted ? 'primary' : 'tertiary'}
                    size='large'
                    className={`w-full !rounded-xl !py-3 ${plan.highlighted ? '!bg-[#6366f1] !border-[#6366f1]' : '!text-[#64748b] hover:!text-[#1e293b]'}`}
                  >
                    立即订阅
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top-up Section */}
      <section className='relative w-full px-4 py-20 md:py-28'>
        <div className='max-w-3xl mx-auto'>
          <div className='flex flex-col md:flex-row items-center gap-6 p-8 rounded-2xl border border-[rgba(99,102,241,0.2)] bg-white shadow-sm'>
            <div className='w-14 h-14 rounded-xl bg-[rgba(99,102,241,0.1)] flex items-center justify-center text-[#6366f1] flex-shrink-0'>
              <IconCreditCard size={28} />
            </div>
            <div className='flex-1 text-center md:text-left'>
              <Title
                heading={4}
                className='!text-xl !font-semibold !text-[#1e293b] mb-2'
              >
                灵活充值
              </Title>
              <Paragraph
                className='!text-sm text-[#64748b] leading-relaxed'
                style={{ color: '#64748b' }}
              >
                按量付费，充多少用多少，余额永久有效。API
                调用优先消耗订阅额度，不足时自动扣充值余额。
              </Paragraph>
            </div>
            <div className='flex flex-col items-center md:items-end gap-3 flex-shrink-0'>
              <div className='flex items-center gap-4 text-sm'>
                <span
                  className='font-medium'
                  style={{ color: '#1e293b' }}
                >
                  ¥1 = $1 额度
                </span>
              </div>
              <div className='flex flex-wrap justify-center md:justify-end gap-2 text-xs'>
                {['全模型通用', '最低 ¥10 起充', '永不过期'].map((tag) => (
                  <span
                    key={tag}
                    className='px-2.5 py-1 rounded-full border border-[rgba(99,102,241,0.25)]'
                    style={{ color: '#6366f1', borderColor: 'rgba(99,102,241,0.25)', backgroundColor: 'rgba(99,102,241,0.05)' }}
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
              <Link to='/console/topup'>
                <Button
                  theme='solid'
                  type='primary'
                  size='large'
                  className='!rounded-xl !px-8 !bg-[#6366f1] !border-[#6366f1] hover:!bg-[#5558e3]'
                >
                  去充值
                </Button>
              </Link>
            </div>
          </div>

          <p className='text-center text-xs text-[#94a3b8] mt-6'>
            充值咨询请加客服微信：P1248978166- / lk2303
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='relative w-full px-4 py-20 md:py-28 bg-white'>
        <div className='max-w-3xl mx-auto'>
          <div className='text-center mb-14'>
            <Title
              heading={2}
              className='!text-3xl md:!text-4xl !font-bold !text-[#1e293b] mb-4'
            >
              有疑问？我们来解答
            </Title>
          </div>

          <Collapse
            className='faq-collapse'
            style={{ backgroundColor: 'transparent', border: 'none' }}
          >
            {faqItems.map((item) => (
              <Collapse.Panel
                key={item.key}
                header={
                  <span className='!text-[#1e293b] font-medium'>
                    {item.header}
                  </span>
                }
                style={{
                  backgroundColor: 'white',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  overflow: 'hidden',
                }}
                bodyStyle={{ padding: '0 20px 20px 20px' }}
                headerStyle={{
                  padding: '16px 20px',
                  backgroundColor: 'transparent',
                }}
              >
                <Paragraph
                  className='!text-sm !text-[#64748b] leading-relaxed'
                  style={{ color: '#64748b' }}
                >
                  {item.content}
                </Paragraph>
              </Collapse.Panel>
            ))}
          </Collapse>
        </div>
      </section>

      {/* Footer CTA */}
      <section className='relative w-full px-4 py-20 md:py-28'>
        <div className='max-w-2xl mx-auto text-center'>
          <Title
            heading={3}
            className='!text-2xl md:!text-3xl !font-bold !text-[#1e293b] mb-4'
          >
            准备好开始了吗？
          </Title>
          <Paragraph
            className='!text-sm text-[#64748b] mb-8'
            style={{ color: '#64748b' }}
          >
            立即注册，获取您的 API Key，接入现有项目只需几分钟。
          </Paragraph>
          <div className='flex flex-row gap-4 justify-center flex-wrap'>
            <Link to='/register'>
              <Button
                theme='solid'
                type='primary'
                size={isMobile ? 'default' : 'large'}
                className='!rounded-full !px-8 !py-3 !bg-[#6366f1] !border-[#6366f1] hover:!bg-[#5558e3]'
              >
                立即注册
              </Button>
            </Link>
            <Link to='/console'>
              <Button
                size={isMobile ? 'default' : 'large'}
                className='!rounded-full !px-8 !py-3 !border-[rgba(0,0,0,0.15)] !text-[#1e293b] hover:!border-[rgba(0,0,0,0.3)] !bg-white'
                icon={<IconPlay />}
              >
                获取密钥
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Model logos strip */}
      <section className='relative w-full px-4 pb-20'>
        <div className='max-w-5xl mx-auto'>
          <div className='text-center mb-8'>
            <Text
              className='!text-sm !text-[#94a3b8]'
              style={{ color: '#94a3b8' }}
            >
              支持众多的大模型供应商
            </Text>
          </div>
          <div className='flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6'>
            {[
              { icon: <Moonshot size={36} />, label: 'Moonshot' },
              { icon: <OpenAI size={36} />, label: 'OpenAI' },
              { icon: <XAI size={36} />, label: 'xAI' },
              { icon: <Zhipu.Color size={36} />, label: 'Zhipu' },
              { icon: <Claude.Color size={36} />, label: 'Claude' },
              { icon: <Gemini.Color size={36} />, label: 'Gemini' },
              { icon: <DeepSeek.Color size={36} />, label: 'DeepSeek' },
              { icon: <Qwen.Color size={36} />, label: 'Qwen' },
              { icon: <Minimax.Color size={36} />, label: 'Minimax' },
              { icon: <Wenxin.Color size={36} />, label: 'Wenxin' },
              { icon: <Midjourney size={36} />, label: 'Midjourney' },
              { icon: <Grok size={36} />, label: 'Grok' },
            ].map((item, i) => (
              <div
                key={i}
                className='w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:opacity-70 transition-opacity duration-200'
                title={item.label}
              >
                {item.icon}
              </div>
            ))}
            <div className='w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center'>
              <Typography.Text
                className='!text-2xl !font-bold'
                style={{ color: '#94a3b8' }}
              >
                30+
              </Typography.Text>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
