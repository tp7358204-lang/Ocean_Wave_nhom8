document.addEventListener("DOMContentLoaded", () => {
  // --- 1. KHAI BÁO BIẾN ---
  const modal = document.getElementById("authModal");
  const btnOpenAuth = document.getElementById("btnOpenAuth");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const showRegister = document.getElementById("showRegister");
  const showLogin = document.getElementById("showLogin");

  const currentUser = localStorage.getItem("currentUser");
  const pageId = window.location.pathname.split("/").pop() || "index.html";

  if (currentUser) {
    if (btnOpenAuth) btnOpenAuth.innerText = "Đăng xuất (" + currentUser + ")";
    const guestBox = document.getElementById("comment-guest");
    const memberBox = document.getElementById("comment-member");
    if (guestBox) guestBox.style.display = "none";
    if (memberBox) memberBox.style.display = "block";
  }

  // --- 3. ĐÓNG/MỞ MODAL ---
  if (btnOpenAuth) {
    btnOpenAuth.onclick = () => {
      if (localStorage.getItem("currentUser")) {
        if (confirm("Bạn có chắc muốn đăng xuất không?")) {
          localStorage.removeItem("currentUser");
          location.reload();
        }
      } else if (modal) {
        modal.style.display = "block";
      }
    };
  }

  if (btnCloseModal)
    btnCloseModal.onclick = () => (modal.style.display = "none");
  if (showRegister)
    showRegister.onclick = () => {
      loginForm.style.display = "none";
      registerForm.style.display = "block";
    };
  if (showLogin)
    showLogin.onclick = () => {
      loginForm.style.display = "block";
      registerForm.style.display = "none";
    };

  // --- 4. XỬ LÝ ĐĂNG KÝ ---
  const btnRegisterAction = document.getElementById("btnRegisterAction");
  if (btnRegisterAction) {
    btnRegisterAction.onclick = () => {
      const user = document.getElementById("regUser").value.trim();
      const pass = document.getElementById("regPass").value.trim();
      if (!user || !pass) return alert("Vui lòng điền đầy đủ!");

      let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
      if (accounts.find((acc) => acc.user === user))
        return alert("Tài khoản này đã tồn tại!");

      accounts.push({ user: user, pass: pass });
      localStorage.setItem("accounts", JSON.stringify(accounts));
      alert("Đăng ký thành công!");
      showLogin.click();
    };
  }

  // --- 5. XỬ LÝ ĐĂNG NHẬP ---
  const btnLoginAction = document.getElementById("btnLoginAction");
  if (btnLoginAction) {
    btnLoginAction.onclick = () => {
      const user = document.getElementById("loginUser").value.trim();
      const pass = document.getElementById("loginPass").value.trim();
      let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
      const found = accounts.find(
        (acc) => acc.user === user && acc.pass === pass,
      );
      if (found) {
        localStorage.setItem("currentUser", user);
        location.reload();
      } else {
        alert("Sai tài khoản hoặc mật khẩu!");
      }
    };
  }

  // --- 6. XỬ LÝ BÌNH LUẬN ---
  const renderComments = () => {
    const commentList = document.getElementById("commentList");
    if (!commentList) return;
    commentList.innerHTML = "";
    const saved = JSON.parse(localStorage.getItem("comments_" + pageId)) || [];
    saved.forEach((cmt) => {
      const div = document.createElement("div");
      div.className = "comment-item";
      div.innerHTML = `<strong>${cmt.user}</strong> <small>${cmt.time}</small><p>${cmt.text}</p>`;
      commentList.appendChild(div);
    });
  };
  renderComments();
const btnPostComment = document.getElementById("btnPostComment");
if (btnPostComment) {
    btnPostComment.onclick = () => {
        const commentInput = document.getElementById("commentInput");
        const text = commentInput.value.trim();
        const currentUser = localStorage.getItem("currentUser");

        if (!text) return alert("Vui lòng nhập nội dung!");
        if (!currentUser) return alert("Bạn cần đăng nhập để bình luận!");

        // Lấy danh sách cũ dựa trên ID trang
        let saved = JSON.parse(localStorage.getItem("comments_" + pageId)) || [];
        
        // Thêm nội dung mới
        saved.push({
            user: currentUser,
            text: text,
            time: new Date().toLocaleString("vi-VN")
        });

        // Lưu lại và vẽ lại giao diện
        localStorage.setItem("comments_" + pageId, JSON.stringify(saved));
        commentInput.value = "";
        renderComments(); 
    };
}
  // --- 7. TÌM KIẾM ---
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.oninput = () => {
      const val = searchInput.value.toLowerCase();
      document.querySelectorAll(".image-item").forEach((item) => {
        item.style.display = item.innerText.toLowerCase().includes(val)
          ? "flex"
          : "none";
      });
    };
  }

  // --- 8. LỌC THỂ LOẠI ---
  const genreLinks = document.querySelectorAll(".filter-genre");
  genreLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedGenre = link.innerText.trim();
      document.querySelectorAll(".image-item").forEach((item) => {
        const itemGenre = item.getAttribute("data-genre") || "";
        item.style.display =
          selectedGenre === "Tất cả" || itemGenre.includes(selectedGenre)
            ? "flex"
            : "none";
      });
    });
  });

  // --- 9. XỬ LÝ SLIDER ---
  const track = document.getElementById("sliderTrack");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  if (track && nextBtn && prevBtn) {
    nextBtn.onclick = () => {
      track.scrollBy({ left: track.clientWidth, behavior: "smooth" });
    };
    prevBtn.onclick = () => {
      track.scrollBy({ left: -track.clientWidth, behavior: "smooth" });
    };
  }
});
const trackView = (title, img, href) => {
  let stats = JSON.parse(localStorage.getItem("comic_stats")) || {};
  if (!stats[title]) {
    stats[title] = { views: 0, img: img, href: href };
  }
  stats[title].views += 1;
  localStorage.setItem("comic_stats", JSON.stringify(stats));
  renderRankings();
};

document.querySelectorAll(".image-item, .slider-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    const title =
      item.querySelector(".comic-title, .slider-info")?.innerText ||
      "Truyện chưa tên";
    const img = item.querySelector("img")?.src || "";
    const href = item.getAttribute("href") || "#";
    trackView(title, img, href);
  });
});
const renderRankings = () => {
  const container = document.getElementById("rankingList");
  if (!container) return;

  let stats = JSON.parse(localStorage.getItem("comic_stats")) || {};
  const sorted = Object.entries(stats)
    .sort((a, b) => b[1].views - a[1].views) 
    .slice(0, 5); 

  if (sorted.length === 0) {
    container.innerHTML =
      "<p style='text-align:center; color:#999;'>Chưa có dữ liệu xếp hạng</p>";
    return;
  }

  container.innerHTML = sorted
    .map(
      ([title, data], index) => `
        <a href="${data.href}" class="ranking-item">
            <span class="rank-number">${index + 1}</span>
            <img src="${data.img}" class="rank-thumb">
            <div class="rank-details">
                <span class="rank-title">${title}</span>
                <span class="rank-views">${data.views} lượt xem</span>
            </div>
        </a>
    `,
    )
    .join("");
};

renderRankings();
