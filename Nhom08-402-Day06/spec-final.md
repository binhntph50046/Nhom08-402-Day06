# 1. AI Product Canvas

## Sản phẩm: Mood-to-Movie (CineMate)

|  | Value | Trust | Feasibility |
|---|---|---|---|
| **Câu hỏi** | User nào? Pain gì? AI giải gì? | Khi AI sai thì sao? User sửa bằng cách nào? | Cost/latency bao nhiêu? Risk chính? |
| **Trả lời** | **User**: Người dùng đối mặt với "nghịch lý lựa chọn", tốn hàng chục phút lướt web mà không biết xem gì. <br><br>**Pain**: Cảm thấy mệt mỏi, cô đơn; cần một người bạn đồng cảm thay vì cỗ máy vô hồn ném ra phim ngẫu nhiên.<br><br>**AI giải gì**: Hệ thống đóng vai chuyên gia tư vấn tâm lý, trích xuất cảm xúc từ đoạn tâm sự để đưa ra trải nghiệm điện ảnh chữa lành. Mục tiêu là trả về Top 15 phim kèm lời khuyên cá nhân hóa. | **Khi AI sai**: Bot hiểu sai mood, gợi ý phim bi kịch khi user đang buồn hoặc bịa ra tên phim không có thực.<br><br>**User sửa thế nào**: Nếu điểm tin cậy (Confident score) < 0.6 tại Node Clarify, hệ thống sẽ chủ động hỏi lại thay vì đoán mò. User có thể chọn lại tiêu chí hoặc cung cấp thêm thông tin để tinh chỉnh cảm xúc.<br><br>**Recovery tốt**: Quy trình 5 node cho phép làm rõ ý định (Clarify) trước khi xuất kết quả cuối, sửa lỗi ngay tại luồng hội thoại. | **Cost**: Phí API gpt-4o để phân tích tâm lý sâu và xử lý 5 node LangGraph. Cần tối ưu Database JSON để tránh chi phí retrieval cao.<br><br>**Latency**: Mục tiêu production là phản hồi tốc độ cao thông qua FastAPI, xử lý hàng triệu phim với độ trễ thấp khi nâng cấp lên Vector Database.<br><br>**Risk chính**: Hallucination (ảo giác); lỗi logic giữa các Node; trích xuất sai Intent cảm xúc khiến user cảm thấy tệ hơn. |

**Automation hay augmentation?** - [ ] Automation  
- [x] Augmentation  

**Justify:** Augmentation vì AI đóng vai trò chuyên gia tư vấn (Mood Parsing) hỗ trợ khám phá nội dung dựa trên cảm xúc, giúp user ra quyết định xem phim trong sự thấu hiểu.

---

## Learning signal

1. **User correction đi vào đâu?** Đi vào:
   - Log hội thoại ban đầu + phản hồi tại Clarify Node.
   - Nút feedback 👍 / 👎 / “Không đúng ý”.
   - Tín hiệu phim nào trong Top 15 được chọn để xem chi tiết.
   - Lịch sử phiên (thread_id) để Agent nhớ người dùng tuần trước buồn vì lý do gì.

2. **Product thu signal gì để biết tốt lên hay tệ đi?** Một số signal chính:
   - Tỷ lệ User đạt được Confident score > 0.6 ngay từ lần hỏi đầu tiên.
   - Tỷ lệ User bấm xem trailer/thông tin từ Top 15 gợi ý.
   - Số lượt User tâm sự dài (biểu hiện sự tin tưởng vào khả năng thấu hiểu).
   - Tỷ lệ User quay lại sử dụng khi có tâm trạng tương tự (Retention theo Mood).

3. **Data thuộc loại nào?** - [x] User-specific (Lịch sử cảm xúc/Session) 
   - [x] Domain-specific (Metadata phim & Genres)
   - [x] Real-time (Cập nhật database phim)
   - [ ] Human-judgment  
   - [x] Khác: Interaction logs / Mood mapping

---

# 2. User Stories × 4 Paths (Mood-to-Movie)

* **Happy Path (Đúng nhu cầu - Phản hồi thấu cảm):**
    * **User:** "Mình vừa trải qua một ngày tồi tệ ở văn phòng, cảm thấy bất lực và muốn tìm lại động lực sống."
    * **AI Agent:** Node 1 trích xuất mood "mệt mỏi, cần động lực". Node 3 & 4 lọc 20 phim và chọn ra Top 15 phim truyền cảm hứng.
    * **Kết quả:** AI phản hồi: "Mình hiểu cảm giác của bạn. Hãy thử xem *The Secret Life of Walter Mitty*..." kèm danh sách 15 gợi ý. User hài lòng bấm Play.

* **Low-confidence Path (Mơ hồ - Node Clarify kích hoạt):**
    * **User:** "Gợi ý phim gì đó hay hay đi."
    * **AI Agent:** Node 2 nhận diện Confident score < 0.6 do thiếu dữ liệu cảm xúc.
    * **AI Agent:** "Để mình tư vấn tốt nhất, bạn đang cảm thấy thế nào? Bạn muốn một bộ phim để cười sảng khoái hay để chiêm nghiệm một mình?"
    * **Kết quả:** User chia sẻ thêm về tâm trạng, giúp Agent đạt độ chính xác cao hơn ở các bước sau.

* **Failure Path (Lỗi/Ngoài phạm vi - Fallback):**
    * **User:** "Đặt cho mình một chiếc Pizza đến địa chỉ nhà."
    * **AI Agent:** Nhận diện yêu cầu không liên quan đến tư vấn phim (Out-of-scope).
    * **AI Agent:** "Xin lỗi bạn, mình là chuyên gia tư vấn phim dựa trên cảm xúc. Tuy nhiên, nếu bạn muốn vừa ăn Pizza vừa xem một bộ phim về ẩm thực chữa lành, mình gợi ý bạn xem *Chef's Table* nhé!"
    * **Kết quả:** Tránh được lỗi bịa đặt tính năng và quay lại đúng vai trò hỗ trợ điện ảnh.

* **Correction Path (User sửa lỗi - Cập nhật Mood):**
    * **User:** "Tìm phim hành động để giải tỏa căng thẳng cho trẻ em."
    * **AI Agent:** Đưa ra 15 phim hành động có phim nhãn R (18+).
    * **User:** "Hành động nhưng đừng máu me quá, mình cần nhãn PG-13."
    * **AI Agent:** Kích hoạt Metadata Filtering, loại bỏ nhãn R, trả về 15 phim hành động gia đình phù hợp.
    * **Kết quả:** User nhận được danh sách đúng ý sau 1 bước sửa.

---

# 3. Eval metrics + threshold

## Optimize Precision hay Recall?
**Lựa chọn: [x] Precision** (Vì người dùng cần sự đồng cảm chính xác, không phải hàng tá lựa chọn gây mệt mỏi thêm).

| Metric | Threshold (Ngưỡng đạt) | Giải thích |
| :--- | :--- | :--- |
| **Precision@15** | $\ge 85\%$ | Trong **15 phim** gợi ý, ít nhất 13 phim phải thực sự khớp với Mood của User. |
| **Confidence Score** | $\ge 0.6$ | Mức độ tin tưởng của LLM khi phân tích cảm xúc ở Node 2 trước khi đi tiếp. |
| **nDCG** | $\ge 0.85$ | Đảm bảo phim "chữa lành nhất" nằm ở vị trí đầu tiên của danh sách 15 phim. |
| **Hallucination Rate** | $< 2\%$ | Agent bịa ra tên phim không có trong database JSON/Vector. |
| **Response Latency** | $< 5s$ | Tổng thời gian chạy qua 5 Node LangGraph để phản hồi user. |
| **Diversity Score** | $\ge 0.7$ | Đảm bảo 15 phim đa dạng về thể loại, năm phát hành, tránh lặp lại. |

---

# 4. Top 3 Failure Mode

**Failure Mode 1: Ảo giác phim (Hallucination)**
- **Trigger**: User yêu cầu tổ hợp mood quá ngách hoặc dữ liệu database bị thiếu hụt.
- **Consequence**: AI tự bịa ra một bộ phim nghe rất "hợp mood" nhưng không có thực.
- **Mitigation**: Pydantic & TypedDict bảo vệ tính toàn vẹn dữ liệu, bắt buộc kiểm tra Show ID trong database trước khi hiển thị (RAG cứng).

**Failure mode 2: Phản tác dụng cảm xúc (Negative Impact)**
- **Trigger**: User đang buồn chán, hệ thống dựa vào từ khóa "buồn" để gợi ý phim bi kịch thay vì phim chữa lành.
- **Consequence**: Người dùng cảm thấy tệ hơn, gây mất niềm tin hoàn toàn vào sản phẩm.
- **Mitigation**: Node 1 Mood Parsing phải ánh xạ rõ ràng: Mood "Buồn" $\rightarrow$ Semantic Query nhắm tới các phim "Chữa lành, tích cực, hy vọng".

**Failure mode 3: Lặp lại gợi ý (Bias Overfitting)**
- **Trigger**: Hệ thống nhớ quá kỹ lịch sử và chỉ gợi ý đi gợi ý lại một vài phim "quốc dân" cho mọi nỗi buồn.
- **Consequence**: User cảm thấy AI nhàm chán, không còn tính khám phá mới mẻ.
- **Mitigation**: Áp dụng Penalty score cho các phim đã xuất hiện trong các session gần nhất của người dùng.

---

# 5. ROI 3 kịch bản (Dựa trên Mood-to-Movie)

## a. Kịch bản: Conservative (Khai thác kho nội dung)
- **Mục tiêu**: Tăng Inventory Utilization cho các phim "chữa lành" ít tên tuổi.
- **Giải pháp**: AI tìm thấy những phim độc lập có thông điệp sâu sắc phù hợp với mood mà bộ lọc cứng bỏ qua.
- **ROI**: Tăng 15-20% lượt xem cho các phim nằm ngoài Top Trending, tối ưu giá trị kho nội dung đã mua bản quyền.

## b. Kịch bản: Realistic (Trải nghiệm người dùng)
- **Mục tiêu**: Giảm thời gian "lướt tìm phim vô định".
- **Giải pháp**: Chatbot rút ngắn quy trình chọn phim từ 20 phút xuống còn dưới 2 phút tâm sự.
- **ROI**: Tăng Daily Watch Time trung bình thêm 15-20 phút/user do họ không còn bỏ cuộc vì mệt mỏi khi chọn phim.

## c. Kịch bản: Optimistic (Lòng trung thành & Thương hiệu)
- **Mục tiêu**: Biến Netflix/CineMate thành một "người bạn tâm giao".
- **Giải pháp**: AI thấu hiểu cả ảnh bầu trời âm u hay giọng nói mệt mỏi thông qua Multimodal trong tương lai.
- **ROI**: Giảm 1-2% Churn rate (tỷ lệ hủy gói). Khách hàng ở lại vì cảm giác được thấu hiểu sâu sắc từ dịch vụ.

---

# 6. Mini AI Chatbot: CineMate (Mood-to-Movie)

## Tổng quan dự án (Overview)
**CineMate** là hệ thống tư vấn phim dựa trên cảm xúc, biến những khoảnh khắc chênh vênh thành trải nghiệm điện ảnh chữa lành thông qua AI thấu hiểu con người.

## Yêu cầu kỹ thuật (Technical Architecture)
* **Orchestration**: LangGraph Pipeline quản lý 5 node (Mood Parsing -> Clarify -> Tools calling -> Lựa chọn -> Lời khuyên).
* **Brain**: OpenAI gpt-4o phân tích ngôn ngữ tự nhiên và trích xuất cảm xúc.
* **Data Integrity**: Pydantic & TypedDict bảo vệ dữ liệu; hướng tới Vector Database (Pinecone/Qdrant) cho quy mô sản xuất.
* **Backend/Frontend**: FastAPI xây dựng RESTful API tốc độ cao, kết hợp React JS cho giao diện người dùng.

## Tiêu chí thành công (Success Metrics)
* **Top 15 Quality**: 15 phim được chọn phải được AI giải thích rõ lý do phù hợp với tâm trạng.
* **Human-like Tone**: Xưng hô "mình - bạn", giọng văn thấu cảm, cá nhân hóa lời khuyên.
* **Precision**: Đạt ngưỡng > 85% độ khớp cảm xúc trong danh sách 15 gợi ý.

---
# Phân Công
- Hoàng Đức Hưng: Canvas
- Lê Hồng Anh: User Stories × 4 Paths
- Nguyễn Hoàng Việt Hùng: Eval metrics và Threshold
- Nguyễn Thị Hương Giang: Top 3 Failure
- Mai Việt Hoàng: 3 ROI 