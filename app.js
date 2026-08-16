const API=(window.SALONEBIZ_API||"").replace(/\/+$/,"");
const $=id=>document.getElementById(id);

async function api(path,options={}){
 if(!API||API.includes("YOUR-BACKEND")) throw new Error("Set your real Render URL in config.js");
 const r=await fetch(API+path,{...options,headers:{"Content-Type":"application/json",...(options.headers||{})}});
 let d; try{d=await r.json()}catch{d={}};
 if(!r.ok) throw new Error(d.message||`Request failed (${r.status})`);
 return d;
}
function message(t,type="bad"){$("msg").textContent=t;$("msg").className="msg "+type}
function mode(m){
 document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.mode===m));
 $("login").classList.toggle("hidden",m!=="login");$("register").classList.toggle("hidden",m!=="register");
 $("msg").className="msg hidden";
}
document.querySelectorAll(".tab").forEach(x=>x.onclick=()=>mode(x.dataset.mode));

$("login").onsubmit=async e=>{
 e.preventDefault();let b=e.submitter;b.disabled=true;b.textContent="Signing in…";
 try{let d=await api("/api/auth/login",{method:"POST",body:JSON.stringify({email:$("le").value.trim(),password:$("lp").value})});
 if(!d.success||!d.user)throw new Error(d.message||"Login failed");sessionStorage.setItem("salonebiz_user",JSON.stringify(d.user));unlock(d.user)
 }catch(err){message(err.message)}finally{b.disabled=false;b.innerHTML="Sign in <b>→</b>"}
};
$("register").onsubmit=async e=>{
 e.preventDefault();let b=e.submitter;b.disabled=true;b.textContent="Creating…";
 try{let d=await api("/api/auth/register",{method:"POST",body:JSON.stringify({name:$("rn").value.trim(),phone:$("rp").value.trim(),email:$("re").value.trim(),password:$("rpass").value})});
 if(!d.success||!d.user)throw new Error(d.message||"Registration failed");sessionStorage.setItem("salonebiz_user",JSON.stringify(d.user));unlock(d.user)
 }catch(err){message(err.message)}finally{b.disabled=false;b.innerHTML="Create account <b>→</b>"}
};
function unlock(u){$("auth").classList.add("hidden");$("app").classList.remove("hidden");$("username").textContent=u.name||"User"}
function lock(){sessionStorage.removeItem("salonebiz_user");$("app").classList.add("hidden");$("auth").classList.remove("hidden");mode("login")}
$("logout").onclick=lock;

async function health(){try{let d=await api("/api/health");if(d.success){$("status").textContent="● API online";$("status").className="online";return}}catch(e){}$("status").textContent="● API offline";$("status").className="offline"}
try{const u=sessionStorage.getItem("salonebiz_user");if(u)unlock(JSON.parse(u))}catch(e){sessionStorage.removeItem("salonebiz_user")}
health();
