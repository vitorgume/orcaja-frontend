import type Response from "../../models/response";
import type Usuario from "../../models/usuario";
import type Login from "../../models/login";
import api from '../../utils/axios';
import type { VerificaoEmail } from "../../models/verificaoEmail";

export function consultarUsuarioPeloId(idUsuario: string): Promise<Response<Usuario>> {
    return api.get<Response<Usuario>>(`/usuarios/${idUsuario}`)
    .then(response => response.data)
    .catch(err => {
        console.error("Erro ao carregar usuario:", err);
        return {
            dado: {} as Usuario,
            erro: err
        }
    })
}

export function cadastrarUsuario(usuario: Usuario): Promise<Response<Usuario>> {
    return api.post<Response<Usuario>>(`/usuarios/cadastro`, usuario)
    .then(response => response.data)
    .catch(err => {
        console.error("Erro ao cadastrar usuario:", err);
        return {
            dado: {} as Usuario,
            erro: err
        }
    })
}

export function logarUsuario(email: string, senha: string): Promise<Response<Login>> {
    return api.post<Response<Login>>(`/login`, {email, senha})
    .then(response => response.data)
    .catch(err => {
        console.error("Erro ao logar usuario:", err);
        return {
            dado: {} as Login,
            erro: err
        }
    })
}

export function verificarCodigo(dadosVerificacao: VerificaoEmail): Promise<Response<VerificaoEmail>> {
    return api.post<Response<VerificaoEmail>>(`/verificaoes/email`, dadosVerificacao)
    .then(response => response.data)
    .catch(err => {
        console.error("Erro ao verificar codigo:", err);
        return {
            dado: {} as VerificaoEmail,
            erro: err
        }
    })
}

export function reenviarCodigoEmail(email: string) {
    return api.post<Response<VerificaoEmail>>(`/usuarios/reenvio/codigo`, {email})
    .then(response => response.data)
    .catch(err => {
        console.error("Erro ao reenviar codigo:", err);
        return {
            dado: {} as VerificaoEmail,
            erro: err
        }
    })
}

export function alterarCpfCnpj(idUsuario: string, novosDados: Usuario): Promise<Response<Usuario>>{
    return api.put<Response<Usuario>>(`/usuarios/${idUsuario}`, novosDados)
    .then(response => response.data)
    .catch(err => {
        console.error("Erro ao alterar cpf/cnpj:", err);
        return {
            dado: {} as Usuario,
            erro: err
        }
    })
}