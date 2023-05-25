/**
 * These interfaces are relevant to the Real World example. They are not part of
 * the Decorator pattern.
 */
interface ControllerRequest {
  url: string
  method: string
  data?: unknown
}

interface ControllerResponse {
  status: number
  data: unknown
}

interface Controller {
  process(request: ControllerRequest): Promise<ControllerResponse>
}

class UserController implements Controller {
  public process(request: ControllerRequest): Promise<ControllerResponse> {
    const users = [
      { id: 1, name: "John" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Alice" },
    ]

    const response: ControllerResponse = {
      status: 200,
      data: {},
    }

    if (request.method === "GET") {
      response.data = users
    } else {
      response.status = 400
      response.data = {
        message: "Bad request",
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(response)
      }, 200)
    })
  }
}

class MyDecorator implements Controller {
  constructor(protected controller: Controller) {}

  public process(request: ControllerRequest): Promise<ControllerResponse> {
    return this.controller.process(request)
  }
}

class TelemetryDecorator extends MyDecorator {
  public override async process(
    request: ControllerRequest
  ): Promise<ControllerResponse> {
    const start = new Date().getTime()

    const result = await super.process(request)

    const end = new Date().getTime()
    const time = end - start

    /**
     * If you want, you can save this telemetry data in a log file
     */
    console.log(`${request.url} ${request.method} => ${time}ms`)

    return result
  }
}

const userController = new TelemetryDecorator(new UserController())
void userController.process({ url: "/users", method: "GET" })
