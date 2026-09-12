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

  it("should classify suggestion as Kurikulum", async () => {
    generateMock.mockResolvedValue({
      result: {
        lang_id: "id",
        classification: "Kurikulum",
      },
    });

    const response = await request(app)
      .post(baseUrl)
      .send({
        lang_id: "id",
        suggesstions:
          "Jadwal pelajaran matematika sebaiknya dibuat lebih teratur.",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          lang_id: "id",
          classification: "Kurikulum",
        }),
      }),
    );

    expect(generateMock).toHaveBeenCalled();
  });

  it("should classify suggestion as Prasarana", async () => {
    generateMock.mockResolvedValue({
      result: {
        lang_id: "id",
        classification: "Prasarana",
      },
    });

    const response = await request(app)
      .post(baseUrl)
      .send({
        lang_id: "id",
        suggesstions:
          "Toilet sekolah perlu diperbaiki karena beberapa fasilitas rusak.",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          lang_id: "id",
          classification: "Prasarana",
        }),
      }),
    );

    expect(generateMock).toHaveBeenCalled();
  });

  it("should classify suggestion as Kesiswaan", async () => {
    generateMock.mockResolvedValue({
      result: {
        lang_id: "id",
        classification: "Kesiswaan",
      },
    });

    const response = await request(app)
      .post(baseUrl)
      .send({
        lang_id: "id",
        suggesstions:
          "Sekolah perlu meningkatkan kegiatan organisasi dan kedisiplinan siswa.",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          lang_id: "id",
          classification: "Kesiswaan",
        }),
      }),
    );

    expect(generateMock).toHaveBeenCalled();
  });
});
