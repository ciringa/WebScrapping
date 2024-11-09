export function sluggen(slug:String){
    return slug
    .toString()                      // Garante que o valor é uma string
    .normalize("NFD")                // Normaliza para remover acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
    .toLowerCase()                   // Converte para letras minúsculas
    .trim()                          // Remove espaços em branco nas extremidades
    .replace(/\s+/g, '-')            // Substitui espaços por hífens
    .replace(/[^a-z0-9-]/g, '')      // Remove caracteres especiais
    .replace(/--+/g, '-'); 
}