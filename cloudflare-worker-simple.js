/**
 * 云音乐AI助手 - DeepSeek-R1 API集成
 * 
 * 这个Worker有两个主要功能：
 * 1. 解决跨域问题(CORS)
 * 2. 连接DeepSeek-R1 API处理用户问题
 */

// 设置CORS头信息
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// 处理OPTIONS请求
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const DEEPSEEK_API_KEY = 'sk-fuclvgmvvtgvnfqwxaguhdwrgyqfnlpwbxeyamlztgruenyd';
const DEEPSEEK_MODEL = 'Pro/deepseek-ai/DeepSeek-R1';

// 处理测试请求
function handleTestRequest() {
  return new Response(
    JSON.stringify({
      success: true,
      message: '你好！这是来自云音乐AI助手的测试响应。',
      timestamp: new Date().toISOString(),
      data: {
        name: '云音乐AI助手',
        version: '2.0.0',
        features: ['音乐推荐', '歌词解析', '艺术家介绍', '音乐趣闻'],
        model: DEEPSEEK_MODEL
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

// 处理AI聊天请求（使用DeepSeek API）
async function handleChatRequest(request) {
  try {
    // 解析用户请求
    const requestData = await request.json();
    const userPrompt = requestData.prompt || '';
    
    if (!userPrompt.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '请输入问题内容'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }
    
    // 构建发送给DeepSeek API的请求体
    // 添加音乐相关的上下文，使AI回答更加专业
    const systemPrompt = "你是云音乐AI助手，一位专业的音乐顾问。你擅长回答关于音乐、歌手、歌曲、音乐历史和音乐理论的问题。请提供准确、有趣、富有洞察力的回答。如果用户的问题与音乐无关，请礼貌地引导他们询问音乐相关的问题。";
    
    const deepseekRequestBody = {
      model: DEEPSEEK_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      stream: false,
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.9,
      response_format: {
        type: "text"
      }
    };
    
    // 发送请求到DeepSeek API
    console.log('发送请求到DeepSeek API...');
    const deepseekResponse = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(deepseekRequestBody)
    });
    
    // 处理DeepSeek的响应
    const deepseekData = await deepseekResponse.json();
    console.log('收到DeepSeek API响应:', JSON.stringify(deepseekData));
    
    // 检查是否有错误
    if (!deepseekResponse.ok) {
      console.error('DeepSeek API错误:', deepseekData);
      return new Response(
        JSON.stringify({
          success: false,
          error: deepseekData.error?.message || '调用AI服务时出错',
          details: deepseekData
        }),
        {
          status: deepseekResponse.status,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }
    
    // 提取AI回答
    const aiResponse = deepseekData.choices?.[0]?.message?.content || '抱歉，AI无法生成回答。';
    
    // 构建符合前端期望的响应格式
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          choices: [{
            message: {
              content: aiResponse
            }
          }],
          model: DEEPSEEK_MODEL,
          usage: deepseekData.usage
        },
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
    console.error('处理请求时发生错误:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: `处理请求时发生错误: ${error.message}`,
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

// 主处理函数
async function handleRequest(request) {
  // 获取请求URL的路径部分
  const url = new URL(request.url);
  const path = url.pathname;

  // 处理OPTIONS请求（CORS预检）
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }

  // 根据路径处理不同的请求
  if (path === '/api/chat') {
    return handleChatRequest(request);
  } else if (path === '/api/test' || path === '/') {
    return handleTestRequest();
  }

  // 如果没有匹配的路径，返回404
  return new Response(
    JSON.stringify({ error: '找不到请求的资源' }),
    {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    }
  );
}

// 注册Worker的fetch事件处理程序
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
