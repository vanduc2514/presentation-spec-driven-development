<!--markpress-opt
{
  "autoSplit": false,
  "sanitize": false,
  "title": "Trí tuệ nhân tạo của bạn không biết bạn muốn gì"
}
markpress-opt-->

<!--slide-attr x=0 y=0 scale=1.2 -->

# AI Của Bạn Không Biết Bạn Muốn Gì
## (Và Bạn Cũng Vậy)

Spec-Driven Development với OpenSpec

<!-- SPEAKER NOTES — Slide 1 (~1 min)
- Put the title up. Say nothing. Let it land.
-->

------

<!--slide-attr x=1700 y=-300 rotate=-2 scale=1.0 -->

# Nội Dung

- Câu chuyện đau thương khi dùng AI thiếu cấu trúc
- AI coding sai ở đâu và tại sao context window giới hạn nó
- Spec-Driven Development (SDD) là gì
- Spec-Driven Development với OpenSpec

<!-- SPEAKER NOTES — Slide 2 (~2 min)
- Quick map of what comes next in the talk.
- Keep this short, then transition directly into the painful story.
-->

------

<!--slide-attr x=2400 y=1600 rotate=-5 scale=1.0 -->

# Câu Chuyện Đau Thương

- Thay đổi nằm rải rác khắp **nhiều microservice repo + legacy monolith repo**
- AI nhảy thẳng vào generate, **không có sự khám phá kỹ lưỡng**
- **Phiên chat dài kiệt sức** với việc phải lái đi lái lại liên tục
- Code sai. Thay đổi sai. **Review từng dòng vô nghĩa.**
- **Hiệu suất** giảm. **Sự bực bội** tăng.
- Tôi bắt đầu **sợ** cái công cụ đáng ra tôi phải yêu thích.

<!-- SPEAKER NOTES — Slide 4 (~2 min)
- This was a real professional project. The codebase was spread across services and a legacy system that the AI had only partial visibility into.
- It didn't know enough — it just started generating confidently.
- I only found the problems at review time, which was already too late. The AI had just enough context to be dangerous, but not enough to be correct.
- The review burden flipped from lightweight check to full audit. That's not sustainable.
-->

------

<!--slide-attr x=3200 y=400 rotate=3 scale=1.0 -->

# Mọi Thứ Sai Ở Đâu?

- Chúng ta đã **vibe coding cho công việc nghiêm túc** — chỉ là không gọi nó bằng cái tên đó
- Prompt của chúng ta là ngôn ngữ nghiệp vụ: nó nói **cái gì**, không phải **làm thế nào**
- AI khám phá codebase — nhưng **đoán mò** chi tiết kỹ thuật chúng ta bỏ sót
- Ý định mơ hồ → hallucination → sai class, sai file, sai giả định

<!-- SPEAKER NOTES — Slide 3 (~2 min)
- Vibe coding isn't just a prototype habit. Any time you prompt without explicit technical intent, you're vibe coding.
- The prompt describes requirements in plain language — suitable for a ticket, not for a compiler.
- The AI doesn't refuse to act on vague input. It fills in the gaps by guessing. It explores the codebase, but it takes shortcuts and picks the path that looks most plausible.
- That's where hallucinations come from — not randomness, but confident guessing on incomplete information.
- And sessions compound the problem: the longer it runs, the more context drifts, and the worse the output gets.
-->

------

<!--slide-attr x=3200 y=400 rotate=3 scale=1.0 -->


<div class="image-only-col">

# Giới Hạn Context Window

<div class="image-only-img">

![context.png](images/context.png)

</div>

</div>

------

<!--slide-attr x=800 y=2300 rotate=2 scale=1.1 -->

# Spec-Driven Development (SDD) Là Gì?

Tạo **spec artifact** trước — mọi thứ khác được suy ra từ nó

**Spec là sự hiểu biết chung giữa bạn và AI**

> BDD, TDD, OpenAPI contract-first, ... đều chia sẻ cùng một khái niệm

<!-- SPEAKER NOTES — Slide 5a (~3 min)
- SDD isn't revolutionary — it's disciplined. The ideas behind it have existed in BDD, TDD, and API-first design for years.
- What's new is using the spec as the context layer you give to AI agents. The AI no longer guesses — it works inside boundaries you reviewed first.
- Each artifact feeds the next. You review each one before the AI proceeds.
-->

------

<!--slide-attr x=-900 y=2200 rotate=-2 scale=1.0 -->

<div class="global-image-col">

# Quy Trình SDD

<div class="col-left">

| Giai đoạn | Mô tả |
|-----------|-------|
| **Spec** | Định nghĩa các artifact **.md** như *prd.md*, *research.md*, *design.md*, *tasks.md*, ... |
| **Implement** | AI đọc Spec artifact và implement trong ngữ cảnh của Spec |
| **Validation** | Kiểm tra implementation với spec |
| **Archive** | Lưu trữ sau khi hoàn thành |

</div>

<div class="col-right">

![sdd.png](images/sdd.png)

</div>

</div>

<!-- SPEAKER NOTES — Slide 5b
- Walk through each stage: Plan scopes the problem. Spec details requirements. Tasks break it into execution steps. Then the AI implements. Validation checks against the spec. Archive keeps context alive.
- The key insight: every stage is a review gate. The AI only moves forward once you've approved the previous artifact.
-->

------

<!--slide-attr x=-2200 y=1200 rotate=4 scale=1.0 -->

# Vibe Coding vs Spec-Driven

| Vibe Coding | Spec-Driven |
|-------------|-------------|
| Prompt → hy vọng | Spec → code chất lượng cao |
| AI đoán phạm vi | AI làm việc trong phạm vi đã định |
| Session thoái hóa | Tiếp tục từ spec bất kỳ lúc nào |
| Review code | Review ý định |
| Một phiên dài hỗn loạn | Thay đổi nhỏ, có phạm vi, rõ ràng |

<!-- SPEAKER NOTES — Slide 6 (~2 min)
- The biggest shift is *when* you review. In vibe coding, you review code after it's written — when it's already expensive to change.
- With SDD, you review intent before the AI writes a single line. Cheap to steer at that stage.
- The session decay problem is solved by the spec itself — you can close a session, open a new one, hand it the spec, and continue exactly where you left off.
-->

------

<!--slide-attr x=-2500 y=100 rotate=-3 scale=1.05 -->

<div class="global-image-col">

# Trình Biên Dịch Ý Định

<div class="col-left">

> Trình biên dịch bắt lỗi trước khi code chạy.
> Spec bắt hiểu lầm trước khi AI code.

- Giai đoạn Spec → **rẻ để điều chỉnh**
- Giai đoạn Implement → đắt để điều chỉnh
- Production → không thể điều chỉnh

</div>

<div class="col-right">

![intent.png](images/intent.png)

</div>

</div>

<!-- SPEAKER NOTES — Slide 7 (~2 min)
- Every developer knows you don't skip compilation. It catches errors early, when they're cheap.
- SDD is the same idea applied to intent. You compile your requirements before the AI touches the keyboard.
- The error cost curve is well-established in software engineering — bugs caught at spec stage cost a fraction of bugs caught at production. SDD moves the review gate to the earliest possible moment.
- This is the frame I want you to carry for the rest of the talk.
-->

------

<!--slide-attr x=-2000 y=-400 rotate=1 scale=1.0 -->

# Review Spec

> Luôn review spec để đảm bảo sự hiểu biết chung giữa bạn và AI

- **Bắt lỗ hổng sớm**: Chúng ta có thiếu edge case nào không?
- **Kiểm tra thiết kế**: Đây có phải pattern đúng không?
- **Kiểm tra phạm vi**: Quá nhiều hay quá ít?
- **Kiểm tra Hallucination**: Điều này đến từ đâu?

<!-- SPEAKER NOTES — Slide 7.5 (~2 min)
- This is the "Review Gate". It's the most critical part of the process.
- You are reviewing the *plan* for code, not the code itself.
- Don't let the AI proceed until you'd be willing to bet on the spec's correctness.
-->

------

<!--slide-attr x=-1400 y=-850 rotate=2 scale=1.0 -->

# SDD với OpenSpec

- OpenSpec là công cụ meta prompt để hướng dẫn AI khám phá context dự án và tạo Spec artifact có phạm vi
- OpenSpec artifact có phạm vi rõ ràng, có thể review được, và hỗ trợ dự án brownfield như công dân hạng nhất

| | spec-kit | GSD | OpenSpec |
|-|----------|-----|----------|
| Khối lượng artifact | Cao | Rất cao | **Thấp** |
| Checkpoint review | Trung bình | Thấp | **Cao** |
| Mức độ nhiễu | Cao | Rất cao | **Thấp** |

<!-- SPEAKER NOTES — Slide 8 (~2 min)
- I tried spec-kit and GSD (Get Shit Done) before landing on OpenSpec. Both are capable tools, but they generate a lot of files — GSD alone creates PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md plus a full research folder per milestone.
- When review is tedious, developers skip it. A spec nobody reads is just documentation debt.
- OpenSpec works differently: each change is a delta — scoped to exactly what's changing, nothing more.
- The explore step is what made it click for brownfield work. Before writing any spec, it understands your existing codebase. The spec it generates is grounded in your actual code, not imagination.
-->

------

<!--slide-attr x=0 y=-200 scale=1.3 -->

# Kết Luận

**AI biết bạn muốn gì (và bạn cũng vậy) nếu có đủ context**

- Câu trả lời không phải là prompt tốt hơn. Mà là sự hiểu biết rõ ràng hơn và spec artifact tốt hơn.
- SDD là ahead-of-time compilation cho ý định của bạn.
- Áp dụng SDD để implement một feature rồi đánh giá.

<!-- SPEAKER NOTES — Slide 9 (~4 min)
- Return to the title. The joke lands differently now — it's not just a punchline, it's a diagnosis.
- The audience has been prompting their AI with business language and hoping the technical gaps fill themselves. They do — just not correctly.
- SDD doesn't slow you down. It moves the thinking earlier, when it's cheap, and frees the AI to execute reliably rather than guess.
- Close with the compiler analogy one more time: "You wouldn't ship without compiling. Don't build without speccing."
- Leave them with one action: pick the next feature on your backlog. Write a spec for it before you touch the AI. Just try it once.
-->

------

<!--slide-attr x=1200 y=-800 rotate=-2 scale=1.2 -->

# Cảm Ơn

Nếu có thắc mắc, hãy liên hệ qua <a href="https://github.com/vanduc2514" target="_blank" rel="noopener noreferrer" style="color: var(--group-accent); text-decoration: underline;">GitHub</a> hoặc quét mã QR bên dưới.

| GitHub | Website |
|---|---|
| ![GitHub QR](images/github-qr.png) | ![Website QR](images/nvduc-qr.png) |
| ![GitHub icon](images/github-icon.svg) | ![Website icon](images/website-icon.svg) |

<!-- SPEAKER NOTES — Thank You Slide
- Thank the audience for their time.
- Invite questions and discussion.
-->
