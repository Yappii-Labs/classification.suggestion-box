# Suggestion Classification

A small API that classifies school suggestions into predefined categories using an AI model.

The classification is based on the `lang_id` provided in the request.

| Language   | `lang_id` | Categories                              |
| ---------- | --------- | --------------------------------------- |
| Indonesian | `id`      | Kurikulum, Prasarana, Kesiswaan         |
| English    | `en`      | Curriculum, Facilities, Student Affairs |

> **Note:** All automated and manual tests in this project use `qwen3:8b` through Ollama. Results may vary when using a different model.

## Requirements

Before running the project, make sure you have these installed:

* Node.js
* pnpm
* Ollama
* The Ollama model used by the application
* Git

## API Request

The API accepts a JSON payload like this:

```json
{
  "lang_id": "id",
  "suggesstions": "Jadwal pelajaran matematika sebaiknya dibuat lebih teratur."
}
```

### `lang_id`

Tells the API which language and category set should be used.

```text
id = Indonesian
en = English
```

### `suggesstions`

The suggestion you want to classify.

> **Heads up:** `suggesstions` is intentionally kept as-is to match the current API contract.

## Automation Tests

Run the full test suite with:

```sh
pnpm test
```

The tests cover the API classification flow for both Indonesian and English suggestions.

## Manual Testing

Want to quickly try the API yourself?

There is a small CLI script available for manual testing:

```sh
sh __test__/cli.test.sh \
  --lang <LANG_ID> \
  --text "<YOUR_TEXT>"
```

### CLI Arguments

| Argument | Required | Description                | Example                        |
| -------- | -------- | -------------------------- | ------------------------------ |
| `--lang` | Yes      | Language of the suggestion | `id` / `en`                    |
| `--text` | Yes      | Suggestion to classify     | `"Improve the school library"` |

### Indonesian Examples

A curriculum-related suggestion:

```sh
sh __test__/cli.test.sh \
  --lang id \
  --text "Jadwal pelajaran matematika sebaiknya dibuat lebih teratur."
```

A facilities-related suggestion:

```sh
sh __test__/cli.test.sh \
  --lang id \
  --text "Toilet sekolah perlu diperbaiki karena beberapa fasilitas rusak."
```

### English Examples

A curriculum-related suggestion:

```sh
sh __test__/cli.test.sh \
  --lang en \
  --text "The mathematics schedule should be organized more effectively."
```

A student affairs-related suggestion:

```sh
sh __test__/cli.test.sh \
  --lang en \
  --text "The school should improve student organization activities."
```

## Example Response

For example, running:

```sh
sh __test__/cli.test.sh \
  --lang id \
  --text "Jadwal pelajaran matematika sebaiknya dibuat lebih teratur."
```

may return:

```json
{
  "data": {
    "lang_id": "id",
    "classification": "Kurikulum"
  },
  "payload": {
    "lang_id": "id",
    "suggesstions": "Jadwal pelajaran matematika sebaiknya dibuat lebih teratur."
  },
  "meta": {
    "startedAt": "2026-09-12T09:14:14.096Z",
    "completedAt": "2026-09-12T09:14:16.674Z",
    "durationMs": 2578,
    "duration": "2.58 seconds"
  }
}
```

Another example using English:

```sh
sh __test__/cli.test.sh \
  --lang en \
  --text "The school should improve student organization activities."
```

Result:

```json
{
  "data": {
    "lang_id": "en",
    "classification": "Student Affairs"
  },
  "payload": {
    "lang_id": "en",
    "suggesstions": "The school should improve student organization activities."
  },
  "meta": {
    "startedAt": "2026-09-12T09:13:30.771Z",
    "completedAt": "2026-09-12T09:13:32.945Z",
    "durationMs": 2173,
    "duration": "2.17 seconds"
  }
}
```

## Classification Categories

The model chooses one category based on the content of the suggestion.

### Curriculum

Suggestions related to learning and academic activities, including:

* Subjects
* Class schedules
* Teaching methods
* Learning materials
* Academic activities

### Facilities

Suggestions about school facilities and infrastructure, such as:

* Classrooms
* Toilets
* Laboratories
* Libraries
* Equipment
* Other physical facilities

### Student Affairs

Suggestions related to students outside the curriculum, including:

* Student organizations
* Student activities
* Discipline
* Extracurricular activities
* Student development

## AI Model

This project uses **Qwen3 8B** running locally through **Ollama**.

The model is intentionally kept local, so no external AI API is required for the classification process.

> Since this is an LLM-based classification, the exact output and response time can vary depending on the model, prompt, and local machine performance.
