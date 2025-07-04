import './menu.css';
import Logo from '../../../../assets/ChatGPT_Image_6_de_jun._de_2025__14_33_15-removebg-preview 2.png';
import OrcamentoItem from '../../../orcamento/componentes/orcamentoItem/orcamentoItem';
import TextoResumo from '../../components/textoResumo/textoResumo';
import { useEffect, useState } from 'react';
import type Usuario from '../../../../models/usuario';
import type Orcamento from '../../../../models/orcamento';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../../orcamento/componentes/loading/Loading';
import { consultarUsuarioPeloId } from '../../usuario.service';
import { listarPorUsuario } from '../../../orcamento/orcamento.service';
import { getId } from '../../../../utils/idTokenUtil';

export default function Menu() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [orcamentos, setOrcamentos] = useState<Orcamento[] | []>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    function calcularValorTotal(orcamentos: Orcamento[]) {
        const total = orcamentos.reduce((total, orcamento) => total + Number(orcamento.orcamentoFormatado.total), 0);
        return total.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }

    function obterCincoOrcamentosMaisRecentes(orcamentos: Orcamento[]) {
        return orcamentos
            .slice()
            .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
            .slice(0, 5);
    }

    useEffect(() => {
        const usuarioId = localStorage.getItem('id-usuario');
        const token = localStorage.getItem('token');

        if (!usuarioId || !token) {
            navigate('/menu');
            return;
        }

        if (!token) {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');

            if (token) {
                localStorage.setItem('token', token);

                const idUsuario = getId(token);
                if (idUsuario) {
                    localStorage.setItem('id-usuario', idUsuario);
                }
            }
        }

        async function carregarDados() {
            try {

                if (usuarioId) {
                    const usuarioResponse = await consultarUsuarioPeloId(usuarioId);
                    const orcamentosResponse = await listarPorUsuario(usuarioId);

                    if (!usuarioResponse.dado || !orcamentosResponse?.dado) {
                        throw new Error("Falha ao carregar dados do usuário.");
                    }

                    setUsuario(usuarioResponse.dado);
                    setOrcamentos(orcamentosResponse.dado.content);
                }
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                navigate('/menu');
            } finally {
                setLoading(false);
            }
        }

        carregarDados();
    }, []);

    return (
        <>
            {!loading ?
                <div className='menu-container'>
                    <header className='header-menu'>
                        {usuario ? <h1>Olá, {usuario.nome} !</h1> : <h1>Olá, visitante !</h1>}
                        <img src={Logo} alt="Logo" />
                    </header>

                    <div className='card-info-geral'>
                        <div className='div-dir-info'>
                            <h2>Resumo mensal</h2>
                            <TextoResumo
                                titulo='Orçamentos:'
                                valor={String(orcamentos.length)}
                            />
                            <TextoResumo
                                titulo='Aprovados:'
                                valor='0'
                            />
                        </div>
                        <p className='valor-total-info-geral'>R$ {calcularValorTotal(orcamentos)}</p>
                    </div>

                    <button className='btn-novo-orcamento' onClick={() => { navigate('/orcamento/cadastro') }}>Novo Orçamento</button>

                    <div className='lista-orcamentos-container'>
                        <div className='header-lista-orcamentos'>
                            <h2>Mais recentes</h2>

                            <Link
                                to='/orcamentos'
                                style={{ textDecoration: 'none', color: '#3B82F6' }}
                            >
                                <p>Ver mais</p>
                            </Link>
                        </div>

                        {orcamentos.length > 0 ? (
                            obterCincoOrcamentosMaisRecentes(orcamentos).map(orc => (
                                <OrcamentoItem
                                    key={orc.id}
                                    orcamento={orc}
                                    handleOpenDeleteModal={() => { }}
                                    deleteButton={false}
                                />
                            ))
                        ) : (
                            <p>Nenhum orçamento encontrado</p>
                        )}


                    </div>
                </div>
                :
                <Loading message="Carregando..." />
            }
        </>
    )
}