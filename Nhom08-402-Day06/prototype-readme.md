# Prototype — Mood-to-Movie: AI Agent Tư Vấn Tâm Lý & Điện Ảnh

## Mô tả Prototpye
Chatbot đóng vai trò "AI Counselor" (người bạn thấu cảm), tiếp nhận đoạn tâm sự của người dùng (ví dụ: áp lực công việc, thất tình), tự động phân tích cảm xúc và khớp ngữ nghĩa để rút trích chính xác Top 3 bộ phim "chữa lành" phù hợp nhất. Hệ thống sẽ sinh ra lời khuyên cá nhân hóa giải thích lý do lựa chọn thay vì chỉ tóm tắt nội dung phim khô khan.

## Level: Working Prototype, Backend/API build bằng FastAPI và LangGraph với cơ chế quản lý luồng trạng thái nghiêm ngặt (Strict State Management).
- 1 flow chính chạy thật với OpenAI API: người dùng nhập tâm sự → chạy qua 4 Nodes (Mood Parsing, Retrieval, LLM Judge, Empathetic Synthesis) → API trả về JSON tách biệt

## Links
- Prototype: https://github.com/binhntph50046/Nhom08-402-Day06.git (nhánh dev)
- Prompt test log: xem trong file 'promot-test.md'
- Video demo (backup): https://drive.google.com/file/d/10LpD39246YF6qyg_QcDnBCYnukgkFS2g/view?usp=drive_link

## Tools
- Orchestration: LangChain & LangGraph
- UI:........
- AI: OpenAI gpt-4o
- Prompt: system prompt

## Phân công
| Thành viên | Phần | Output |
|-----------|------|--------|
|Nguyễn Thị Hương Giang| Top 3 Failure spec + prompt-test + feedback các nhóm| file prompt-test.md + top 3  failure trong file spec-final.md|
