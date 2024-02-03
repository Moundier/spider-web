export function now() {
  const options = {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo'
  };

  return new Intl.DateTimeFormat('en-US', options).format(new Date());
}


// Example Usage
console.log(now());

