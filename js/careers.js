/* ==========================================================================
   NIGERIAN AIR FORCE — Careers: 3-step eligibility guide (client-side only)
   ========================================================================== */
(function () {
  "use strict";
  const form = document.getElementById("eligForm");
  if (!form) return;
  const steps = Array.from(form.querySelectorAll(".form-step"));
  const marks = Array.from(form.querySelectorAll(".stepper .s"));
  const prev = document.getElementById("prevStep");
  const next = document.getElementById("nextStep");
  const result = document.getElementById("eligResult");
  let i = 0;

  function show(n) {
    i = n;
    steps.forEach((s, k) => s.classList.toggle("active", k === i));
    marks.forEach((m, k) => { m.classList.toggle("done", k < i); m.classList.toggle("current", k === i); });
    prev.style.visibility = i ? "visible" : "hidden";
    next.innerHTML = i === steps.length - 1 ? 'See my route <i class="bi bi-check2"></i>' : 'Next <i class="bi bi-arrow-right"></i>';
    const f = steps[i].querySelector("input, select");
    if (f && focus) f.focus({ preventScroll: true });
  }
  let focus = false;

  function valid(step) {
    let ok = true;
    step.querySelectorAll("[required]").forEach((el) => {
      let good = el.value.trim() !== "";
      if (el.type === "number") good = good && +el.value >= +el.min && +el.value <= +el.max;
      el.closest(".field").classList.toggle("invalid", !good);
      if (!good) ok = false;
    });
    return ok;
  }
  form.addEventListener("input", (e) => { const f = e.target.closest(".field"); if (f) f.classList.remove("invalid"); });

  prev.addEventListener("click", () => { result.className = "eligibility-result"; show(i - 1); });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!valid(steps[i])) return;
    if (i < steps.length - 1) { show(i + 1); return; }
    marks.forEach((m) => { m.classList.add("done"); m.classList.remove("current"); });
    evaluate();
  });

  function evaluate() {
    const age = +form.age.value;
    const citizen = form.citizen.value;
    const edu = form.edu.value;
    const nysc = form.nysc.value;
    const interest = form.interest.value;
    let title, body, ok = true;

    if (citizen === "no") {
      ok = false;
      title = "Not eligible for this route";
      body = "Nigerian Air Force entry is generally open only to Nigerian citizens by birth.";
    } else if (age < 17) {
      ok = false;
      title = "Not yet. Keep preparing";
      body = "You are below the usual minimum age. Focus on strong credits in English, Mathematics and Physics, and keep fit.";
    } else if ((edu === "degree" || edu === "prof") && age <= 35) {
      title = "Suggested route: Direct Short Service Commission";
      body = "Your qualification fits officer direct entry into a professional branch" + (interest === "medical" ? ", such as Medical Services" : interest === "tech" ? ", such as Aircraft Engineering or ICT" : "") + "." + (nysc === "no" ? " You will usually need your NYSC discharge or exemption certificate first." : "");
    } else if (edu === "ssce" && age <= 22 && interest === "fly") {
      title = "Suggested route: NDA Regular Course (Air Force cadet)";
      body = "As a school-leaver interested in flying, the Nigerian Defence Academy cadet route is the main path to commission as a pilot.";
    } else if ((edu === "ssce" || edu === "nd") && age <= 22) {
      title = "Suggested route: Airmen / Airwomen recruitment";
      body = "You can enlist as an Aircraftman or Aircraftwoman and train in a trade. " + (edu === "ssce" ? "The NDA cadet route is also open to you if you want to be an officer." : "Your trade certificate can count towards technical trades.");
    } else {
      ok = false;
      title = "Check the advertised age limits";
      body = "You may be above the usual age limit for the route that matches your qualification. Some specialist calls accept older candidates, so check each exercise's requirements.";
    }

    result.className = `eligibility-result show ${ok ? "ok" : "no"}`;
    result.innerHTML = `
      <span class="eyebrow ${ok ? "green" : ""}" style="margin-bottom:10px">${ok ? "Result" : "Guidance"}</span>
      <h3 class="h3">${title}</h3>
      <p>${body}</p>
      <a class="btn-gaf btn-sm-gaf" href="https://airforce.mil.ng" target="_blank" rel="noopener">Official NAF website <i class="bi bi-box-arrow-up-right"></i></a>
      <button type="button" class="btn-gaf btn-ghost btn-sm-gaf ms-2" id="restartElig">Start again</button>`;
    document.getElementById("restartElig").addEventListener("click", () => { form.reset(); result.className = "eligibility-result"; show(0); });
  }

  show(0);
  focus = true;
})();
