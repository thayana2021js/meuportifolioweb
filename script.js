const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
const progressBar = document.getElementById("progressBar");
const topButton = document.getElementById("topButton");
const chatForm = document.getElementById("chatForm");
const opinionsList = document.getElementById("opinionsList");
const reveals = document.querySelectorAll(".reveal");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});

document.querySelectorAll(".menu a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");
  });
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / documentHeight) * 100;

  progressBar.style.width = `${progress}%`;
  topButton.style.display = scrollTop > 500 ? "block" : "none";

  reveals.forEach((item) => {
    const itemTop = item.getBoundingClientRect().top;
    if (itemTop < window.innerHeight - 100) {
      item.classList.add("active");
    }
  });
});

topButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

function getOpinions() {
  return JSON.parse(localStorage.getItem("portfolioOpinions")) || [];
}

function saveOpinions(opinions) {
  localStorage.setItem("portfolioOpinions", JSON.stringify(opinions));
}

function renderOpinions() {
  const opinions = getOpinions();
  opinionsList.innerHTML = "";

  if (opinions.length === 0) {
    opinionsList.innerHTML = `
      <div class="opinion-item">
        <strong>Aguardando opiniões...</strong>
        <p>Seja a primeira pessoa a deixar uma mensagem para Thayana.</p>
      </div>
    `;
    return;
  }

  opinions.slice().reverse().forEach((opinion) => {
    const item = document.createElement("div");
    item.className = "opinion-item";
    item.innerHTML = `
      <strong>${opinion.nome}</strong>
      <small>${opinion.email} • ${opinion.data}</small>
      <p>${opinion.mensagem}</p>
    `;
    opinionsList.appendChild(item);
  });
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const mensagem = document.getElementById("mensagem").value.trim();

  if (!nome || !email || !mensagem) {
    alert("Preencha todos os campos para enviar sua opinião.");
    return;
  }

  const opinions = getOpinions();

  opinions.push({
    nome,
    email,
    mensagem,
    data: new Date().toLocaleDateString("pt-BR")
  });

  saveOpinions(opinions);
  renderOpinions();
  chatForm.reset();

  alert("Obrigada! Sua opinião foi registrada no MiniChat Boot.");
});

renderOpinions();

window.dispatchEvent(new Event("scroll"));
