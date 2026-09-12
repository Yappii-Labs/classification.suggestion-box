import app from "../src/app";
import request from "supertest";
import { OllamaConnect } from "../src/lib/ollama-connect";

jest.mock("../src/lib/ollama-connect");

const mockedOllamaConnect = jest.mocked(OllamaConnect);
const baseUrl = "/api/suggestions";

describe(`POST ${baseUrl}`, () => {
  let generateMock: jest.Mock;

  beforeEach(() => {
    generateMock = jest.fn();

    mockedOllamaConnect.create.mockResolvedValue({
      generate: generateMock,
    } as unknown as OllamaConnect);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should classify suggestion as Curriculum", async () => {
    generateMock.mockResolvedValue({
      result: {
        lang_id: "en",
        classification: "Curriculum",
      },
    });

    const response = await request(app)
      .post(baseUrl)
      .send({
        lang_id: "en",
        suggesstions:
          "The mathematics schedule should be organized more effectively.",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          lang_id: "en",
          classification: "Curriculum",
        }),
      }),
    );

    expect(generateMock).toHaveBeenCalled();
  });

  it("should classify suggestion as Facilities", async () => {
    generateMock.mockResolvedValue({
      result: {
        lang_id: "en",
        classification: "Facilities",
      },
    });

    const response = await request(app)
      .post(baseUrl)
      .send({
        lang_id: "en",
        suggesstions:
          "The school toilets need to be repaired because some facilities are damaged.",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          lang_id: "en",
          classification: "Facilities",
        }),
      }),
    );

    expect(generateMock).toHaveBeenCalled();
  });

  it("should classify suggestion as Student Affairs", async () => {
    generateMock.mockResolvedValue({
      result: {
        lang_id: "en",
        classification: "Student Affairs",
      },
    });

    const response = await request(app)
      .post(baseUrl)
      .send({
        lang_id: "en",
        suggesstions:
          "The school should improve student organization activities and discipline.",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          lang_id: "en",
          classification: "Student Affairs",
        }),
      }),
    );

    expect(generateMock).toHaveBeenCalled();
  });
});
