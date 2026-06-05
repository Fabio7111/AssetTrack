package AssetTrack.service;

import AssetTrack.dto.AquisicaoRequestDTO;
import AssetTrack.dto.AquisicaoResponseDTO;
import AssetTrack.model.Aquisicao;
import AssetTrack.repository.AquisicaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AquisicaoService {

    @Autowired
    private AquisicaoRepository aquisicaoRepository;

    public AquisicaoResponseDTO registrarAquisicao(AquisicaoRequestDTO data) {
        Aquisicao aquisicao = new Aquisicao();
        aquisicao.setFornecedor(data.fornecedor());
        aquisicao.setDataCompra(data.dataCompra());
        aquisicao.setNumeroNotaFiscal(data.numeroNotaFiscal());
        aquisicao.setValorTotal(data.valorTotal());

        aquisicaoRepository.save(aquisicao);
        return new AquisicaoResponseDTO(aquisicao);
    }

    public List<AquisicaoResponseDTO> listarAquisicoes() {
        return aquisicaoRepository.findAll().stream()
                .map(AquisicaoResponseDTO::new)
                .toList();
    }

    public AquisicaoResponseDTO atualizarAquisicao(UUID id, AquisicaoRequestDTO data) {
        Aquisicao aquisicao = aquisicaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Aquisição não encontrada."));

        aquisicao.setFornecedor(data.fornecedor());
        aquisicao.setDataCompra(data.dataCompra());
        aquisicao.setNumeroNotaFiscal(data.numeroNotaFiscal());
        aquisicao.setValorTotal(data.valorTotal());

        aquisicaoRepository.save(aquisicao);
        return new AquisicaoResponseDTO(aquisicao);
    }

    public void deletarAquisicao(UUID id) {
        Aquisicao aquisicao = aquisicaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Aquisição não encontrada."));

        aquisicaoRepository.delete(aquisicao);
    }
}