package AssetTrack.service;

import AssetTrack.repository.AquisicaoRepository;
import AssetTrack.repository.SolicitacaoManutencaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired private AquisicaoRepository aquisicaoRepository;
    @Autowired private SolicitacaoManutencaoRepository solicitacaoRepository;

    public Map<String, Object> obterDadosDashboard() {
        BigDecimal totalInvestido = aquisicaoRepository.somarTotalInvestimentos();
        Long totalPendentes = solicitacaoRepository.contarSolicitacoesPendentes();

        return Map.of(
                "totalInvestido", totalInvestido != null ? totalInvestido : BigDecimal.ZERO,
                "chamadosPendentes", totalPendentes
        );
    }
}