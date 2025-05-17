/**
 * 云音乐AI助手 - DeepSeek-R1 API集成 (GraphQL版本)
 *
 * 这个Worker有三个主要功能：
 * 1. 解决跨域问题(CORS)
 * 2. 提供GraphQL API接口处理前端请求
 * 3. 连接DeepSeek-R1 API处理用户问题
 *
 * GraphQL是一种用于API的查询语言和运行时，它允许客户端准确地获取所需的数据，
 * 不多不少，使API更加灵活和高效。
 */

/**
 * 设置CORS头信息
 *
 * CORS (跨源资源共享) 是一种HTTP头机制，允许服务器指定除自己以外的其他源（域、协议或端口），
 * 使浏览器允许这些源访问加载服务器的资源。
 */
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', // 允许任何源访问资源
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // 允许的HTTP方法
    'Access-Control-Allow-Headers': 'Content-Type, Authorization', // 允许的HTTP头
    'Access-Control-Max-Age': '86400', // 预检请求结果的缓存时间（秒）
  };
}

/**
 * 处理OPTIONS请求（预检请求）
 *
 * 在跨域请求中，浏览器会先发送OPTIONS请求检查服务器是否允许实际请求，
 * 这个函数返回204状态码（无内容）和CORS头信息，告诉浏览器允许后续请求。
 */
function handleOptions() {
  return new Response(null, {
    status: 204, // 204表示成功但无内容返回
    headers: corsHeaders(),
  });
}

/**
 * DeepSeek API配置
 *
 * 这些常量用于配置与DeepSeek AI服务的连接参数
 */
const DEEPSEEK_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const DEEPSEEK_API_KEY = 'sk-fuclvgmvvtgvnfqwxaguhdwrgyqfnlpwbxeyamlzxxxxxxxx'; // 换成自己的硅基流动个人账号的key
const DEEPSEEK_MODEL = 'Pro/deepseek-ai/DeepSeek-R1';

/**
 * GraphQL Schema定义
 *
 * 这里定义了GraphQL API的类型和操作，包括：
 * - Query: 查询操作（获取数据）
 * - Mutation: 变更操作（修改数据）
 * - 自定义类型: TestResponse, ChatResponse, Choice, Message, Usage等
 */
const typeDefs = `
  # 测试响应类型
  type TestResponseData {
    name: String!
    version: String!
    features: [String!]!
    model: String!
  }

  type TestResponse {
    success: Boolean!
    message: String!
    timestamp: String!
    data: TestResponseData!
  }

  # 聊天消息类型
  type Message {
    content: String!
  }

  # AI选择类型
  type Choice {
    message: Message!
  }

  # 使用情况统计
  type Usage {
    prompt_tokens: Int!
    completion_tokens: Int!
    total_tokens: Int!
  }

  # 聊天响应数据
  type ChatResponseData {
    choices: [Choice!]!
    model: String!
    usage: Usage
  }

  # 聊天响应
  type ChatResponse {
    success: Boolean!
    message: String!
    data: ChatResponseData
    error: String
  }

  # 查询类型
  type Query {
    # 获取测试响应
    test: TestResponse!
  }

  # 变更类型
  type Mutation {
    # 发送聊天消息
    chat(prompt: String!): ChatResponse!
  }
`;

/**
 * 处理测试请求
 *
 * 返回一个测试响应，包含AI助手的基本信息和功能列表
 * 在GraphQL中作为Query.test解析器使用
 */
function handleTestRequest() {
  // 构建测试响应数据
  const testResponseData = {
    success: true,
    message: '你好！这是来自云音乐AI助手的测试响应。',
    timestamp: new Date().toISOString(),
    data: {
      name: '云音乐AI助手',
      version: '2.0.0',
      features: ['音乐推荐', '歌词解析', '艺术家介绍', '音乐趣闻'],
      model: DEEPSEEK_MODEL,
    },
  };

  return testResponseData;
}

/**
 * 处理AI聊天请求（使用DeepSeek API）
 *
 * 接收用户的问题，调用DeepSeek API获取回答
 * 在GraphQL中作为Mutation.chat解析器使用
 *
 * @param {Object} args - GraphQL参数对象
 * @param {string} args.prompt - 用户输入的问题
 * @returns {Promise<Object>} 包含AI回答的响应对象
 */
async function handleChatRequest(args) {
  try {
    // 从GraphQL参数中获取用户问题
    const userPrompt = args.prompt || '';

    // 验证输入
    if (!userPrompt.trim()) {
      return {
        success: false,
        error: '请输入问题内容',
      };
    }

    // 构建发送给DeepSeek API的请求体
    // 添加音乐相关的上下文，使AI回答更加专业
    const systemPrompt =
      '你是云音乐AI助手，一位专业的音乐顾问。你擅长回答关于音乐、歌手、歌曲、音乐历史和音乐理论的问题。请提供准确、有趣、富有洞察力的回答。如果用户的问题与音乐无关，请礼貌地引导他们询问音乐相关的问题。';

    const deepseekRequestBody = {
      model: DEEPSEEK_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      stream: false,
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.9,
      response_format: {
        type: 'text',
      },
    };

    // 发送请求到DeepSeek API
    console.log('发送请求到DeepSeek API...');
    const deepseekResponse = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(deepseekRequestBody),
    });

    // 处理DeepSeek的响应
    const deepseekData = await deepseekResponse.json();
    console.log('收到DeepSeek API响应:', JSON.stringify(deepseekData));

    // 检查是否有错误
    if (!deepseekResponse.ok) {
      console.error('DeepSeek API错误:', deepseekData);
      return {
        success: false,
        error: deepseekData.error?.message || '调用AI服务时出错',
        message: '请求失败',
      };
    }

    // 提取AI回答
    const aiResponse =
      deepseekData.choices?.[0]?.message?.content || '抱歉，AI无法生成回答。';

    // 构建GraphQL响应
    return {
      success: true,
      data: {
        choices: [
          {
            message: {
              content: aiResponse,
            },
          },
        ],
        model: DEEPSEEK_MODEL,
        usage: deepseekData.usage,
      },
      message: '请求成功',
    };
  } catch (error) {
    console.error('处理请求时发生错误:', error);
    return {
      success: false,
      error: `处理请求时发生错误: ${error.message}`,
      message: '服务器内部错误',
    };
  }
}

/**
 * GraphQL解析器映射
 *
 * 定义GraphQL Schema中各个字段的解析函数
 * - Query: 查询操作的解析器
 * - Mutation: 变更操作的解析器
 */
const resolvers = {
  Query: {
    // 测试查询解析器
    test: () => handleTestRequest(),
  },
  Mutation: {
    // 聊天变更解析器
    chat: (_, args) => handleChatRequest(args),
  },
};

/**
 * 解析GraphQL查询
 *
 * 这是一个简化版的GraphQL解析器，用于处理GraphQL查询和变更
 * 在生产环境中，通常会使用成熟的GraphQL库如Apollo Server或graphql-js
 *
 * @param {string} query - GraphQL查询字符串
 * @param {Object} variables - 查询变量
 * @param {string} operationName - 操作名称
 * @returns {Promise<Object>} 查询结果
 */
async function executeGraphQL(query, variables, operationName) {
  // 简单的查询解析 - 在实际应用中应使用完整的GraphQL解析器
  // 这里我们使用简单的正则表达式来解析查询

  // 检查是否是测试查询
  if (query.includes('query') && query.includes('test')) {
    return { data: { test: resolvers.Query.test() } };
  }

  // 检查是否是聊天变更
  if (query.includes('mutation') && query.includes('chat')) {
    // 从变量中提取prompt
    const prompt = variables?.prompt || '';
    const result = await resolvers.Mutation.chat(null, { prompt });
    return { data: { chat: result } };
  }

  // 如果无法识别查询类型，返回错误
  return {
    errors: [{ message: '无法解析GraphQL查询' }],
  };
}

/**
 * 主处理函数
 *
 * 处理所有传入的HTTP请求，根据请求类型和路径分发到不同的处理函数
 *
 * @param {Request} request - 传入的HTTP请求对象
 * @returns {Promise<Response>} HTTP响应对象
 */
async function handleRequest(request) {
  // 获取请求URL的路径部分
  const url = new URL(request.url);
  const path = url.pathname;

  // 处理OPTIONS请求（CORS预检）
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }

  // 处理GraphQL请求 - 统一入口点
  if (path === '/graphql') {
    try {
      // 解析请求体
      const { query, variables, operationName } = await request.json();

      // 执行GraphQL查询
      const result = await executeGraphQL(query, variables, operationName);

      // 返回GraphQL响应
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      });
    } catch (error) {
      console.error('GraphQL处理错误:', error);
      return new Response(
        JSON.stringify({
          errors: [{ message: `GraphQL处理错误: ${error.message}` }],
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

  // 为了兼容性，保留原来的REST API端点
  if (path === '/api/chat') {
    try {
      const requestData = await request.json();
      const result = await handleChatRequest({ prompt: requestData.prompt });
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      });
    } catch (error) {
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
  } else if (path === '/api/test' || path === '/') {
    const result = handleTestRequest();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    });
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

/**
 * 注册Worker的fetch事件处理程序
 *
 * 当Cloudflare Worker收到HTTP请求时，会触发fetch事件
 * 这里我们将所有请求交给handleRequest函数处理
 */
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
