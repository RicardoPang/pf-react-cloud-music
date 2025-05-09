/**
 * Cloudflare Worker - ChatGPT API代理
 *
 * 这个Worker有两个主要功能：
 * 1. 解决跨域问题(CORS)
 * 2. 代理请求到OpenAI的ChatGPT API
 */

// 配置常量
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
// 注意：实际使用时需要替换为你的OpenAI API密钥
// 出于安全考虑，建议使用Cloudflare Workers的环境变量存储
const OPENAI_API_KEY = ''; // 请在Cloudflare Workers控制台设置此环境变量

// 处理OPTIONS请求的CORS预检
function handleOptions(request) {
  // 创建一个新的响应，允许所有来源的请求
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

// 设置CORS头信息
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', // 允许任何来源访问
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 预检请求的结果可以缓存24小时
  };
}

// 处理ChatGPT API请求
async function handleChatGPTRequest(request) {
  try {
    // 从请求中获取用户消息
    const { prompt, model = 'gpt-3.5-turbo' } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: '缺少必要的prompt参数' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      });
    }

    // 构建发送给OpenAI API的请求体
    const openAIRequestBody = {
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    };

    // 发送请求到OpenAI API
    const openAIResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(openAIRequestBody),
    });

    // 获取OpenAI的响应
    const openAIData = await openAIResponse.json();

    // 构建我们自己的响应
    return new Response(
      JSON.stringify({
        success: true,
        data: openAIData,
        message: '请求成功',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    // 处理错误情况
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || '处理请求时发生错误',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 处理测试请求（不需要OpenAI API密钥）
function handleTestRequest() {
  return new Response(
    JSON.stringify({
      success: true,
      message: '你好！这是来自Cloudflare Worker的测试响应。',
      timestamp: new Date().toISOString(),
      data: {
        name: '云音乐AI助手',
        version: '1.0.0',
        features: ['音乐推荐', '歌词解析', '艺术家介绍'],
      },
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    }
  );
}

// 主处理函数
async function handleRequest(request) {
  // 获取请求URL的路径部分
  const url = new URL(request.url);
  const path = url.pathname;

  // 处理OPTIONS请求（CORS预检）
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  // 根据路径处理不同的请求
  if (path === '/api/chat' && request.method === 'POST') {
    return handleChatGPTRequest(request);
  } else if (path === '/api/test' && request.method === 'GET') {
    return handleTestRequest();
  }

  // 如果没有匹配的路径，返回404
  return new Response(JSON.stringify({ error: '找不到请求的资源' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
  });
}

// 注册Worker的fetch事件处理程序
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
